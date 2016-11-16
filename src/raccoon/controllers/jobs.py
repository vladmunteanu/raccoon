import logging

from . import BaseController
from ..models import Job

log = logging.getLogger(__name__)


class JobsController(BaseController):
    """
    Jobs Controller
    """
    model = Job
    audit_logs = True
