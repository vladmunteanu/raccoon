import logging

from raccoon.controllers import BaseController
from raccoon.models import Right

log = logging.getLogger(__name__)


class RightsController(BaseController):
    model = Right
