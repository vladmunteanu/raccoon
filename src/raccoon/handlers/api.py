from __future__ import absolute_import

import logging
import json
import traceback

import tornado.web
import tornado.websocket

from raccoon.urls import Router
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
        verb = jdata.get('verb').lower()

        try:
            if verb not in self.ALLOWED_VERBS:
                raise ReplyError(403)

            controller, params = Router.get(resource)
            method = getattr(controller, verb, None)

            if not method:
                raise ReplyError(404)

            params.update(jdata)
            response = method(**params)

            self.write_message(json.dumps(response))
        except ReplyError as e:
            self.write_message(str(e))
        except Exception as e:
            ex = ReplyError(500)
            # ex.details = traceback.format_exc()
            self.write_message(str(ex))

    def on_close(self):
        log.info('WebSocket closed')
