from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Method

log = logging.getLogger(__name__)

class MethodsController(BaseController):
    """
    Methods Controller
    """
    model = Method

