import logging

from mongoengine.errors import DoesNotExist
from tornado import gen

from raccoon.external.interfaces.bitbucketserver import BitbucketServerInterface
from raccoon.controllers import BaseController
from raccoon.models import Project
from raccoon.utils.decorators import authenticated
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class BitbucketServerController(BaseController):

    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, method=None, project=None, *args, **kwargs):
        try:
            project = Project.objects.get(id=project)
        except DoesNotExist:
            raise ReplyError(422)

        bitbucketserver = BitbucketServerInterface(connector=project.connector)
        method = getattr(bitbucketserver, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(project=project, **kwargs)

        request.send(response)
