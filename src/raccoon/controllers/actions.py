import logging

from raccoon.controllers import BaseController
from raccoon.models import Action

log = logging.getLogger(__name__)


class ActionsController(BaseController):
    model = Action
    audit_logs = True
