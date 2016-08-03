from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import Action

log = logging.getLogger(__name__)


class ActionsController(BaseController):
    """
    Actions Controller
    """
    model = Action
