from __future__ import absolute_import

import json
import logging
from tornado import gen

from raccoon.utils.utils import json_serial

log = logging.getLogger(__name__)
CLIENT_CONNECTIONS = {}

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

    def serialize(self, data):
        return {
            'requestId': self.requestId,
            'verb': self.verb,
            'resource': self.resource,
            'data': data,
            'code': 200,
            'message': 'OK',
        }

    @gen.coroutine
    def send(self, response):
        data = self.serialize(response)
        self.socket.write_message(json.dumps(data, default=json_serial))

    @gen.coroutine
    def broadcast(self, response):
        data = self.serialize(response)
        for connection_id, socket in CLIENT_CONNECTIONS.items():
            if connection_id != self.socket.connection_id:
                # mark the broadcast as notification by removing the requestId
                data['requestId'] = None

            socket.write_message(json.dumps(data, default=json_serial))
