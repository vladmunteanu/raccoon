import logging

from . import BaseController
from ..models import Flow

log = logging.getLogger(__name__)


class FlowsController(BaseController):
    """
    Flows Controller
    """
    model = Flow
    audit_logs = True
