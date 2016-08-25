from __future__ import absolute_import

import logging

from .base import BaseController
from ..models import Project

log = logging.getLogger(__name__)


class ProjectsController(BaseController):
    """
    Projects Controller
    """
    model = Project
