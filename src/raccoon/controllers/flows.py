import logging

from raccoon.controllers import BaseController
from raccoon.models import Flow

log = logging.getLogger(__name__)


class FlowsController(BaseController):
    model = Flow
    audit_logs = True
