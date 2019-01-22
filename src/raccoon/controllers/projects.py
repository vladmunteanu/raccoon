import logging

from raccoon.controllers import BaseController
from raccoon.models import Project
from raccoon.utils.exceptions import ReplyError


log = logging.getLogger(__name__)


class ProjectsController(BaseController):
    model = Project
    audit_logs = True

    @classmethod
    def check_rights(cls, object, rights):
        for right in rights:
            if object['id'] in right.projects:
                return object
        return None
