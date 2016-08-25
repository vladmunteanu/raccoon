import logging

from tornado import gen

from ..utils.decorators import authenticated
from ..utils.exceptions import ReplyError
from .base import BaseController
from ..interfaces.salt import SaltStackInterface
from ..models import Connector


log = logging.getLogger(__name__)


class SaltController(BaseController):
    """
        SaltStack controller
    """

    @classmethod
    @authenticated
    @gen.coroutine
    def post(cls, request, method=None, connectorId=None, *args, **kwargs):
        connector = yield Connector.objects.get(id=connectorId)

        salt_interface = SaltStackInterface(connector)
        method = getattr(salt_interface, method, None)

        if not method:
            raise ReplyError(404)

        response = yield method(**kwargs)

        yield request.send(response)
