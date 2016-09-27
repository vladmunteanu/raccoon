from __future__ import absolute_import

import json
import logging
from tornado import gen

from .utils import json_serial

log = logging.getLogger(__name__)
CLIENT_CONNECTIONS = {}


class Request(object):
    def __init__(self, idx, verb, resource, token,
                 data, socket, *args, **kwargs):
        self.request_id = idx
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

    def serialize(self, data, verb=None, resource=None):
        return {
            'requestId': self.request_id,
            'verb': verb or self.verb,
            'resource': resource or self.resource,
            'data': data,
            'code': 200,
            'message': 'OK',
        }

    @gen.coroutine
    def send(self, response=None):
        data = self.serialize(response)
        self.socket.write_message(json.dumps(data, default=json_serial))

    def broadcast(self, response=None, verb=None, resource=None):
        data = self.serialize(response, verb, resource)
        for connection_id, socket in CLIENT_CONNECTIONS.items():
            # mark the broadcast as notification for other users
            if self.socket and connection_id == self.socket.connection_id:
                data['requestId'] = self.request_id
            else:
                data['requestId'] = 'notification'
            socket.write_message(json.dumps(data, default=json_serial))
