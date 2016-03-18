from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Flow

log = logging.getLogger(__name__)

class FlowsController(BaseController):
    """
    Flows Controller
    """
    model = Flow

