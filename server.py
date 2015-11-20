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
from raccoon.handlers import WebHandler, ApiHandler


log = logging.getLogger(__name__)


class Application(tornado.web.Application):
    """
    Main Application
    """
    def __init__(self):
        handlers = [
            (r'/', WebHandler),
            (r'/api/v1/(.*)', ApiHandler),
            (r'/static/(.*)', tornado.web.StaticFileHandler, dict(path=APP['static_path'])),
        ]
        tornado.web.Application.__init__(self, handlers, **APP)

        # show requests in stdout
        tornado.options.parse_command_line()

def main():
    app = Application()
    app.listen(PORT)

    # Connect to Mongo Server
    io_loop = tornado.ioloop.IOLoop.instance()
    connect(DB['name'], host=DB['host'], port=DB['port'], io_loop=io_loop)

    tornado.ioloop.IOLoop.current().start()



if __name__ == '__main__':
    main()
