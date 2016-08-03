from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import Flow

log = logging.getLogger(__name__)


class FlowsController(BaseController):
    """
    Flows Controller
    """
    model = Flow
