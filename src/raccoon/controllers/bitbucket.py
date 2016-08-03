from __future__ import absolute_import

import logging

from tornado import gen

from ..interfaces.bitbucket import BitbucketInterface
from .base import BaseController
from ..models import Project
from ..utils.decorators import authenticated
from ..utils.exceptions import ReplyError

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
        project = yield Project.objects.get(id=project)
        if not project:
            raise ReplyError(422)

        # load references
        yield project.load_references()

        # create GitHub interface & select operation
        bitbucket = BitbucketInterface(connector=project.connector)
        method = getattr(bitbucket, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(project=project)

        yield request.send(response)
