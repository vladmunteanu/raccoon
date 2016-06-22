#!/usr/bin/env python

from __future__ import absolute_import

import logging
import os

from motorengine.connection import connect
import tornado
import tornado.ioloop
import tornado.options
import tornado.web

from settings import DB, APP, PORT
from raccoon.handlers import WebHandler, ApiWebSocketHandler

# !important tasks are imported and assigned to interfaces
from raccoon.tasks import tasks


log = logging.getLogger(__name__)


class Application(tornado.web.Application):
    """
    Main Application
    """
    def __init__(self):
        handlers = [
            (r'^/websocket/?', ApiWebSocketHandler),
            (r'^/static/(.*)/?', tornado.web.StaticFileHandler, dict(path=APP['static_path'])),

            # web handler should be last because it's regex is generic
            (r'^/(.*)/?', WebHandler),
        ]
        tornado.web.Application.__init__(self, handlers, **APP)

        # show requests in stdout
        tornado.options.parse_command_line()

def main():
    app = Application()
    app.listen(PORT)

    # Connect to MongoDB Server
    io_loop = tornado.ioloop.IOLoop.instance()
    connect(DB['name'], host=DB['host'], port=DB['port'], io_loop=io_loop)

    tornado.ioloop.IOLoop.current().start()



if __name__ == '__main__':
    main()
