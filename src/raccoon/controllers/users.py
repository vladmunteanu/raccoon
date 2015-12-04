from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import User

log = logging.getLogger(__name__)

class UsersController(BaseController):
    """
    Projects Controller
    """
    model = User

