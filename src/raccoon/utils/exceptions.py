from __future__ import absolute_import

import json
import logging
import traceback
from http.server import BaseHTTPRequestHandler

from ..settings import DEBUG


log = logging.getLogger(__name__)


ERROR_MESSAGES = BaseHTTPRequestHandler.responses


class ReplyError(Exception):
    """
    API Reply Error Exception
    """

    def __init__(self, code, message=None, request_id=None,
                 verb=None, resource=None):
        self.code = code
        self.message = message
        self.request_id = request_id
        self.verb = verb
        self.resource = resource

        if not message:
            self.message, _ = ERROR_MESSAGES.get(code)

    def to_json(self):
        response = {
            'code': self.code,
            'message': self.message,
            'requestId': self.request_id,
            'verb': self.verb,
            'resource': self.resource,
        }

        if DEBUG and self.code == 500:
            response['details'] = traceback.format_exc()

        return json.dumps(response)

    def __repr__(self):
        return self.to_json()

    def __str__(self):
        return self.to_json()
