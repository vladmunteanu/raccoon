from __future__ import absolute_import

import json
import logging
from tornado import gen

from raccoon.utils.utils import json_serial

log = logging.getLogger(__name__)

class Request(object):
    def __init__(self, idx, verb, resource, token, data, socket, *args, **kwargs):
        self.requestId = idx
        self.verb = verb
        self.resource = resource
        self.token = token
        self.data = data
        self.socket = socket

        for key, value in kwargs.items():
            setattr(self, key, value)

        self.currentUser = None

    @property
    def user(self):
        return self.currentUser

    @user.setter
    def user(self, user):
        self.currentUser = user

    @gen.coroutine
    def send(self, response):
        self.socket.write_message(json.dumps({
            'requestId': self.requestId,
            'verb': self.verb,
            'resource': self.resource,
            'data': response,
        }, default=json_serial))
