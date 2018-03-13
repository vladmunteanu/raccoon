import logging

from raccoon.controllers import BaseController
from raccoon.models import Job

log = logging.getLogger(__name__)


class JobsController(BaseController):
    model = Job
    audit_logs = True
