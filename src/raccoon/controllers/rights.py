from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import Right

log = logging.getLogger(__name__)


class RightsController(BaseController):
    """
    Rights Controller
    """
    model = Right
