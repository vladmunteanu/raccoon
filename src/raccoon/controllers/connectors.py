from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Connector

log = logging.getLogger(__name__)

class ConnectorsController(BaseController):
    """
    Connectors Controller
    """
    model = Connector

