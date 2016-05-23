from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Task

log = logging.getLogger(__name__)

class TasksController(BaseController):
    """
    Tasks Controller
    """
    model = Task
