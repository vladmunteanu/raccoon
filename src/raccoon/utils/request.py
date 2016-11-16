import json
import logging

import jwt
from mongoengine import DoesNotExist

from ..models import User
from .utils import json_serial
from ..settings import SECRET

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

        self.user_data = {}
        self.is_admin = False
        self._process_token()

        self._user = None

    @property
    def user(self):
        if not self._user:
            try:
                self._user = User.objects.get(id=self.user_data.get('id'))
            except DoesNotExist:
                self._user = None
        return self._user

    def serialize(self, data, verb=None, resource=None):
        return {
            'requestId': self.request_id,
            'verb': verb or self.verb,
            'resource': resource or self.resource,
            'data': data,
            'code': 200,
            'message': 'OK',
        }

    def send(self, response=None):
        data = self.serialize(response)
        self.socket.write_message(json.dumps(data, default=json_serial))

    def broadcast(self, response=None, verb=None, resource=None, admin_only=False):
        """
            Broadcasts a message on all websocket connections.

        :param response: message to send
        :type response: dict
        :param verb: verb used in the underlying protocol
        :type verb: str
        :param resource: the resource used in the underlying protocol
        :type resource: str
        :param admin_only: ensures that only admins will receive the message
        :type admin_only: bool
        """
        data = self.serialize(response, verb, resource)
        for connection_id, socket in CLIENT_CONNECTIONS.items():
            # mark the broadcast as notification for other users
            if self.socket and connection_id == self.socket.connection_id:
                data['requestId'] = self.request_id
            else:
                data['requestId'] = 'notification'
            if admin_only and not socket.is_admin:
                continue
            socket.write_message(json.dumps(data, default=json_serial))

    def _process_token(self):
        """ Processes the JWT token and sets user_data and is_admin. """
        if not self.token:
            return
        try:
            self.user_data = jwt.decode(self.token, SECRET,
                                        algorithms=['HS256'])
        except jwt.DecodeError:
            log.warning(["Cannot decode token", self.token])
        else:
            self.is_admin = self.user_data.get('role') == 'admin'


def broadcast(response=None, verb=None, resource=None, admin_only=False):
    """
        Broadcasts a message on all websocket connections.

    :param response: message to send
    :type response: dict
    :param verb: verb used in the underlying protocol
    :type verb: str
    :param resource: the resource used in the underlying protocol
    :type resource: str
    :param admin_only: ensures that only admins will receive the message
    :type admin_only: bool
    """

    data = {
        'verb': verb,
        'resource': resource,
        'data': response,
        'code': 200,
        'message': 'OK',
    }
    for connection_id, socket in CLIENT_CONNECTIONS.items():
        # mark the broadcast as notification for other users
        data['requestId'] = 'notification'
        if admin_only and not socket.is_admin:
            continue
        socket.write_message(json.dumps(data, default=json_serial))
