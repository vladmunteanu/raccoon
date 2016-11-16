import logging

from . import BaseController
from ..models import Right

log = logging.getLogger(__name__)


class RightsController(BaseController):
    """
    Rights Controller
    """
    model = Right
