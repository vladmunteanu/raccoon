import logging

from . import BaseController
from ..models import Environment

log = logging.getLogger(__name__)


class EnvironmentsController(BaseController):
    """
    Environments Controller
    """
    model = Environment
    audit_logs = True
