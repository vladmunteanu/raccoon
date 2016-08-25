from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import AuditLog

log = logging.getLogger(__name__)


class AuditlogsController(BaseController):
    """
    Auditlogs Controller
    """
    model = AuditLog
