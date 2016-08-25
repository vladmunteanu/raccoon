from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import Environment

log = logging.getLogger(__name__)


class EnvironmentsController(BaseController):
    """
    Environments Controller
    """
    model = Environment
