import logging

from raccoon.controllers import BaseController
from raccoon.models import Environment
from raccoon.utils.exceptions import ReplyError


log = logging.getLogger(__name__)


class EnvironmentsController(BaseController):
    model = Environment
    audit_logs = True

    @classmethod
    def filter_response(cls, response, rights):
        def check_rights(object):
            for right in rights:
                #env_ids = [ e.get_dict()['id'] for e in right.environments ]
                if object['id'] in right.environments:
                    return object
            return None

        if not rights:
            return response


        # treat rights if there is only one object in the response
        if type(response) is dict:
            if check_rights(response):
                return response
            else:
                ReplyError(404)

        result = list()
        # filter objects that should be returned
        for object in response:
            if check_rights(object):
                result.append(object)

        return result
