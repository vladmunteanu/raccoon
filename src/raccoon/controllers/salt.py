import logging

from tornado import gen

from ..utils.decorators import authenticated
from ..utils.exceptions import ReplyError
from .base import BaseController
from ..interfaces.salt import SaltStackInterface
from ..models import Connector, AuditLog


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

        audit_log = AuditLog(user=request.user.email,
                             action=kwargs.get('fun'),
                             project=kwargs.get('service_type'),
                             environment=kwargs.get('target_env'),
                             message="Salt master operation")
        yield audit_log.save()

        request.broadcast(audit_log.get_dict(),
                          verb="post", resource="/api/v1/auditlogs/",
                          admin_only=True)

        yield request.send(response)
