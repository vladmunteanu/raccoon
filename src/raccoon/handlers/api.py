from __future__ import absolute_import

import logging
import json
from tornado import gen

import tornado.web
import tornado.websocket

from raccoon.urls import Router
from raccoon.utils.request import Request
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)

class ApiWebSocketHandler(tornado.websocket.WebSocketHandler):
    """
    API WebSocket Handler
    """

    ALLOWED_VERBS = ('get', 'post', 'put', 'delete', 'patch')

    def open(self):
        log.info('WebSocket opened')

    def check_authorization(self):
        return True

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

        try:
            if verb not in self.ALLOWED_VERBS:
                raise ReplyError(403)

            controller, params = Router.get(resource)
            method = getattr(controller, verb, None)

            if not method:
                raise ReplyError(404)

            params.update(body)
            params.update(args)
            req = Request(
                idx=jdata.get('requestId'),
                verb=jdata.get('verb'),
                resource=jdata.get('resource'),
                token=jdata.get('headers', {}).get('cookie'),
                data=jdata,
                socket=self
            )
            yield method(req, **params)
        except ReplyError as e:
            self.write_message(str(e))
        except Exception:
            ex = ReplyError(500)
            self.write_message(str(ex))

    def on_close(self):
        log.info('WebSocket closed')
