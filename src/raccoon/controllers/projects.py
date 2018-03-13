import logging

from raccoon.controllers import BaseController
from raccoon.models import Project

log = logging.getLogger(__name__)


class ProjectsController(BaseController):
    model = Project
    audit_logs = True
