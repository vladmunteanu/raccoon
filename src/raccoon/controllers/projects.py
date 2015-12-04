from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Project

log = logging.getLogger(__name__)

class ProjectsController(BaseController):
    """
    Projects Controller
    """
    model = Project
