from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import Install

log = logging.getLogger(__name__)


class InstallsController(BaseController):
    """
    Installs Controller
    """
    model = Install
