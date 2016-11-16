import logging

from . import BaseController
from ..models import Action

log = logging.getLogger(__name__)


class ActionsController(BaseController):
    """
    Actions Controller
    """
    model = Action
    audit_logs = True
