from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Environment

log = logging.getLogger(__name__)


class EnvironmentsController(BaseController):
    """
    Environments Controller
    """
    model = Environment
