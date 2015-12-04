from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import AuditLog

log = logging.getLogger(__name__)

class AuditlogsController(BaseController):
    """
    Projects Controller
    """
    model = AuditLog

