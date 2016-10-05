from __future__ import absolute_import

import logging
import datetime

from tornado import gen
from motorengine import DESCENDING

from .base import BaseController
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
            Fetches and returns audit logs from the past 3 days.
            If pk is specified, then the result will be the audit log
            corresponding to that private key.

        :param request: http request
        :param pk: private key
        :param args: arguments
        :param kwargs: keyword arguments
        :return: audit logs
        """
        if pk:
            response = yield cls.model.objects.get(id=pk)
            if not response:
                raise ReplyError(404)

            response = response.get_dict()
        else:
            response = yield cls.model.objects.filter(date_added__gte=(datetime.datetime.utcnow() - datetime.timedelta(days=3))).order_by('date_added', direction=DESCENDING).find_all()
            response = [r.get_dict() for r in response]

        yield request.send(response)
