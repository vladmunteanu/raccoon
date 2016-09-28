from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import Job

log = logging.getLogger(__name__)


class JobsController(BaseController):
    """
    Jobs Controller
    """
    model = Job
    audit_logs = True
