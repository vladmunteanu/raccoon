import logging

from raccoon.controllers import BaseController
from raccoon.models import Environment
from raccoon.utils.exceptions import ReplyError


log = logging.getLogger(__name__)


class EnvironmentsController(BaseController):
    model = Environment
    audit_logs = True

    @classmethod
    def check_rights(cls, object, rights):
        for right in rights:
            if object['id'] in right.environments:
                return object
        return None
