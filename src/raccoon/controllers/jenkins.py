from __future__ import absolute_import

import logging
from tornado import gen

from raccoon.utils.decorators import authenticated
from raccoon.utils.exceptions import ReplyError
from raccoon.controllers.base import BaseController
from raccoon.interfaces.jenkins import JenkinsInterface
from raccoon.models import Flow, Connector, Job


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
            "resource": "/api/v1/jenkins/build",
            "verb": "get"
        }
        """
    
    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, method=None, *args, **kwargs):
        results = yield Connector.objects.filter(type='jenkins').find_all()
        if not len(results):
            raise ReplyError(422)

        connector = results[0]

        # create Jenkins interface
        jenkins = JenkinsInterface(connector)
        method = getattr(jenkins, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(request=request, *args, **kwargs)
        yield request.send(response)

    @classmethod
    @authenticated
    @gen.coroutine
    def post(cls, request, method=None, flow=None, job=None, *args, **kwargs):
        if flow:
            flow = yield Flow.objects.get(id=flow)
            if not flow:
                raise ReplyError(422)

            # load references
            yield flow.load_references()
            yield flow.job.load_references()
            connector = flow.job.connector
        else:
            results = yield Connector.objects.filter(type='jenkins').find_all()
            if not len(results):
                raise ReplyError(422)

            connector = results[0]

        if job:
            job = yield Job.objects.get(id=job)
            if not job:
                raise ReplyError(422)

        # create Jenkins interface
        jenkins = JenkinsInterface(connector)
        method = getattr(jenkins, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(request=request, flow=flow, job=job, *args, **kwargs)
        yield request.send(response)
