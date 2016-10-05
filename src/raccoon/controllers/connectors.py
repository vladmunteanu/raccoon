from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import Connector

log = logging.getLogger(__name__)


class ConnectorsController(BaseController):
    """
    Connectors Controller
    """
    model = Connector
    audit_logs = True
