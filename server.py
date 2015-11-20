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


log = logging.getLogger(__name__)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html', title='Raccoon - Deployment Tool', cdn='web')

class PingHandler(tornado.web.RequestHandler):
    def get(self):
        self.write({'ping': 'pong'})

class Application(tornado.web.Application):
    """
    Main Application
    """
    def __init__(self):
        handlers = [
            (r'/', MainHandler),
            (r'/ping', PingHandler),
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
