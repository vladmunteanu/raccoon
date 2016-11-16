import logging
import datetime

from tornado import gen
from mongoengine.errors import DoesNotExist

from . import BaseController
from ..models import AuditLog
from ..utils.decorators import is_admin
from ..utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class AuditlogsController(BaseController):
    """
    Auditlogs Controller
    """
    model = AuditLog

    @classmethod
    @is_admin
    @gen.coroutine
    def get(cls, request, pk=None, *args, **kwargs):
        """
            Fetches and returns audit logs for the past 3 days.
        If pk is specified, then the result will be the audit log
        associated to that primary key.

        :param request: http request
        :param pk: audit log primary key
        :param args: not used
        :param kwargs: not used
        :return: audit logs
        """
        if pk:
            try:
                response = cls.model.objects.get(id=pk)
            except DoesNotExist:
                raise ReplyError(404)

            response = response.get_dict()
        else:
            response = cls.model.objects.filter(
                date_added__gte=(
                    datetime.datetime.utcnow() - datetime.timedelta(days=3)
                )).order_by('+date_added').all()
            response = [r.get_dict() for r in response]

        request.send(response)
