import logging

from raccoon.controllers import BaseController
from raccoon.models import Connector

log = logging.getLogger(__name__)


class ConnectorsController(BaseController):
    model = Connector
    audit_logs = True
