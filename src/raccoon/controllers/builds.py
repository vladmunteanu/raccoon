from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Build

log = logging.getLogger(__name__)

class BuildsController(BaseController):
    """
    Builds Controller
    """
    model = Build

