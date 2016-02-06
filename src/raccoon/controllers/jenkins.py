from __future__ import absolute_import

import logging
from tornado import gen

from raccoon.controllers.base import BaseController
from raccoon.interfaces.jenkins import JenkinsInterface
from raccoon.models import Action, Project
from raccoon.utils.decorators import authenticated
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)

class JenkinsController(BaseController):
    """
        Jenkins Controller
        
        Request:
        ----------
        {
            "verb": "get",
            "resource": "/api/v1/jenkins/build",
            "args": {
                "action": "<action_id>"
            },
            "requestId": "abc123",
            "headers": {
                "Authorization": "Bearer <access_token>"
            }
        }
        
        Response:
        ----------
        {
            "data": {
            },
            "requestId": "abc123",
            "resource": "/api/v1/github/branches",
            "verb": "get"
        }
        """
    
    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, method=None, action=None, *args, **kwargs):
        action = yield Action.objects.get(id=action)
        if not action:
            raise ReplyError(422)

        # load references
        yield action.load_references()
        yield action.method.load_references()
        
        # create GitHub interface & select operation
        jenkins = JenkinsInterface(connector=action.method.connector)
        method = getattr(jenkins, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(action=action, *args, **kwargs)

        yield request.send(response)