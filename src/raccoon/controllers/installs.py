import logging

from . import BaseController
from ..models import Install

log = logging.getLogger(__name__)


class InstallsController(BaseController):
    """
    Installs Controller
    """
    model = Install
