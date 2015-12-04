from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Install

log = logging.getLogger(__name__)

class InstallsController(BaseController):
    """
    Projects Controller
    """
    model = Install

