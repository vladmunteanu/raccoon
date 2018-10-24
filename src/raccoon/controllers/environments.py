import logging

from raccoon.controllers import BaseController
from raccoon.models import Environment

log = logging.getLogger(__name__)


class EnvironmentsController(BaseController):
    model = Environment
    audit_logs = True
