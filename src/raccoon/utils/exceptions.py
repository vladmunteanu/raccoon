from __future__ import absolute_import

import json
import logging


log = logging.getLogger(__name__)


ERROR_MESSAGES = {}


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
        return json.dumps({
            'code': self.code,
            'message': self.message,
        })

    def __repr__(self):
        return self.to_json()

    def __str__(self):
        return self.to_json()
