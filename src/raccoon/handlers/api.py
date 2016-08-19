from __future__ import absolute_import

import logging
import json
from tornado import gen

import tornado.websocket

from ..urls import Router
from ..utils.request import Request, CLIENT_CONNECTIONS
from ..utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class ApiWebSocketHandler(tornado.websocket.WebSocketHandler):
    """
    API WebSocket Handler
    """

    ALLOWED_VERBS = ('get', 'post', 'put', 'delete', 'patch')

    @property
    def connection_id(self):
        """
        Returns a unique connection id
        """
        return self.request.headers.get('Sec-Websocket-Key')

    def check_authorization(self):
        return True

    @gen.coroutine
    def open(self):
        # save all connections to use in broadcast
        CLIENT_CONNECTIONS[self.connection_id] = self
        log.info(['WebSocket opened', CLIENT_CONNECTIONS.keys()])

    @gen.coroutine
    def on_message(self, message):
        """
        javascript
        function f() {
            ws = new WebSocket("ws://raccoon.local:8888/websocket");
            ws.onopen = function() {
               ws.send('{"verb": "get", "resource": "/api/v1/projects/"}')
            };
            ws.onmessage = function (evt) {
               console.log(evt.data);
            };
        }
        """

        jdata = json.loads(message)
        resource = jdata.get('resource')
        body = jdata.get('body', {})
        args = jdata.get('args', {})
        verb = jdata.get('verb').lower()
        request_id = jdata.get('requestId')

        auth_header = jdata.get('headers', {}).get('Authorization', '')
        parts = auth_header.split('Bearer ')
        token = None
        if len(parts) == 2:
            token = parts[1]

        try:
            if verb not in self.ALLOWED_VERBS:
                raise ReplyError(403)
            controller, params = Router.get(resource)
            method = getattr(controller, verb, None)

            if not method:
                raise ReplyError(404)

            if verb in ('put', 'post'):
                params.update(body)
            else:
                params.update(args)
            req = Request(
                idx=request_id,
                verb=verb,
                resource=resource,
                token=token,
                data=jdata,
                socket=self
            )
            yield method(req, **params)
        except ReplyError as e:
            e.request_id = request_id
            e.verb = verb
            e.resource = resource

            # log error
            if e.code >= 400:
                log.error('Possible error detected', exc_info=True)
            self.write_message(str(e))
        except Exception:
            ex = ReplyError(500, request_id=request_id,
                            verb=verb, resource=resource)
            self.write_message(str(ex))
            log.error('Internal server error', exc_info=True)

    @gen.coroutine
    def on_close(self):
        # remove connection after user disconnected
        CLIENT_CONNECTIONS.pop(self.connection_id, None)
        log.info(['WebSocket closed', CLIENT_CONNECTIONS.keys()])
