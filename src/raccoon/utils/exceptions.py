from __future__ import absolute_import

import json
import logging
import traceback


log = logging.getLogger(__name__)


ERROR_MESSAGES = {
    200: 'Success',
    403: 'Not authorized',
    404: 'Not found',
    500: 'Internal Server Error',
}


class ReplyError(Exception):
    """
    API Reply Error Exception
    """

    def __init__(self, code, message=None):
        self.code = code
        self.message = message

        if not message:
            self.message = ERROR_MESSAGES.get(code)

    def to_json(self):
        response = {
            'code': self.code,
            'message': self.message,
        }
        if True:
            response['details'] = traceback.format_exc()

        return json.dumps(response)

    def __repr__(self):
        return self.to_json()

    def __str__(self):
        return self.to_json()
