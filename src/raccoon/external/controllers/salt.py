import logging

from mongoengine.errors import DoesNotExist
from tornado import gen

from raccoon.external.interfaces.salt import SaltStackInterface
from raccoon.controllers import BaseController
from raccoon.models import Connector, AuditLog
from raccoon.utils.decorators import authenticated
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class SaltController(BaseController):

    @classmethod
    @authenticated
    @gen.coroutine
    def post(cls, request, method=None, connectorId=None, *args, **kwargs):
        try:
            connector = Connector.objects.get(id=connectorId)
        except DoesNotExist:
            raise ReplyError(404)

        salt_interface = SaltStackInterface(connector)
        method = getattr(salt_interface, method, None)

        if not method:
            raise ReplyError(404)

        response = yield method(**kwargs)

        user = request.user
        audit_log = AuditLog(
            user=user.email,
            action=kwargs.get('fun'),
            project=kwargs.get('service_type'),
            environment=kwargs.get('target_env'),
            message="Salt master operation"
        )
        audit_log.save()

        request.broadcast(
            audit_log.get_dict(),
            verb="post", resource="/api/v1/auditlogs/",
            admin_only=True
        )

        request.send(response)
