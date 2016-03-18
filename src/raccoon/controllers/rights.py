from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Right

log = logging.getLogger(__name__)

class RightsController(BaseController):
    """
    Rights Controller
    """
    model = Right

