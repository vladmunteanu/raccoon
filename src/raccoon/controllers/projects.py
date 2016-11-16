import logging

from . import BaseController
from ..models import Project

log = logging.getLogger(__name__)


class ProjectsController(BaseController):
    """
    Projects Controller
    """
    model = Project
    audit_logs = True
