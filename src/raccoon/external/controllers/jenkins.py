import logging

from mongoengine.errors import DoesNotExist
from tornado import gen

from ..interfaces.jenkins import JenkinsInterface
from ...controllers import BaseController
from ...models import Flow, Connector, Job
from ...utils.decorators import authenticated
from ...utils.exceptions import ReplyError

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
        results = Connector.objects.filter(type='jenkins').all()
        if not len(results):
            raise ReplyError(422)

        connector = results[0]

        # create Jenkins interface
        jenkins = JenkinsInterface(connector)
        method = getattr(jenkins, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(request=request, *args, **kwargs)
        request.send(response)

    @classmethod
    @authenticated
    @gen.coroutine
    def post(cls, request, method=None, flow_id=None, job_id=None, *args, **kwargs):
        job = None
        flow = None
        if flow_id:
            try:
                flow = Flow.objects.get(id=flow_id)
            except DoesNotExist:
                raise ReplyError(422)

            connector = flow.job.connector
        else:
            results = Connector.objects.filter(type='jenkins').all()
            if not len(results):
                raise ReplyError(422)

            connector = results[0]

        if job_id:
            try:
                job = Job.objects.get(id=job_id)
            except DoesNotExist:
                raise ReplyError(422)

        # create Jenkins interface
        jenkins = JenkinsInterface(connector)
        method = getattr(jenkins, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(request=request, flow=flow,
                                job=job, *args, **kwargs)
        request.send(response)
