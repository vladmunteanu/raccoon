import logging

from mongoengine.errors import DoesNotExist
from tornado import gen

from raccoon.external.interfaces.bitbucket import BitbucketInterface
from raccoon.controllers import BaseController
from raccoon.models import Project
from raccoon.utils.decorators import authenticated
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class BitbucketController(BaseController):
    """
    Bitbucket Controller

    Request:
    ----------
    {
        "verb": "get",
        "resource": "/api/v1/bitbucket/branches",
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
        try:
            project = Project.objects.get(id=project)
        except DoesNotExist:
            raise ReplyError(422)

        # create GitHub interface & select operation
        bitbucket = BitbucketInterface(connector=project.connector)
        method = getattr(bitbucket, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(project=project)

        request.send(response)
