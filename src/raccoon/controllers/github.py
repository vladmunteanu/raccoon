from __future__ import absolute_import

import logging
from tornado import gen

from raccoon.interfaces.github import GitHubInterface
from raccoon.controllers.base import BaseController
from raccoon.models import Action, Project
from raccoon.utils.decorators import authenticated
from raccoon.utils.exceptions import ReplyError
from settings import SECRET

log = logging.getLogger(__name__)

class GitHubController(BaseController):
    """
    Github Controller

    Request:
    ----------
    {
        "verb": "get",
        "resource": "/api/v1/github/branches",
        "args": {
            "project": "<project_id>"
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
    def get(cls, request, method=None, project=None, *args, **kwargs):
        project = yield Project.objects.get(id=project)
        if not project:
            raise ReplyError(422)

        # load references
        yield project.load_references()

        # create GitHub interface & select operation
        github = GitHubInterface(connector=project.connector)
        method = getattr(github, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(project=project)

        yield request.send(response)