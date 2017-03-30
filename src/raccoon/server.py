import logging

import tornado
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.httpserver
from mongoengine import connect

from .settings import DB, APP, HOST, PORT, SSL_OPTIONS
from .handlers import WebHandler, ApiWebSocketHandler
from .tasks.jenkins import resume_ongoing_tasks

log = logging.getLogger(__name__)


class Application(tornado.web.Application):
    """Main Application"""
    def __init__(self):
        handlers = [
            (r'^/websocket/?', ApiWebSocketHandler),
            (r'^/static/(.*)/?', tornado.web.StaticFileHandler,
             dict(path=APP['static_path'])),

            # web handler should be last because it's regex is generic
            (r'^/(.*)/?', WebHandler),
        ]
        tornado.web.Application.__init__(self, handlers, **APP)

        # show requests in stdout
        tornado.options.parse_command_line()


def main():
    app = Application()

    server_options = {}
    if SSL_OPTIONS['certfile'] and SSL_OPTIONS['keyfile']:
        server_options['ssl_options'] = SSL_OPTIONS

    server = tornado.httpserver.HTTPServer(app, **server_options)

    server.listen(PORT, address=HOST)

    # Connect to MongoDB Server
    connect(DB['name'], host=DB['host'], port=DB['port'])

    resume_ongoing_tasks()

    tornado.ioloop.IOLoop.current().start()


if __name__ == '__main__':
    main()
