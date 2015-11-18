from __future__ import absolute_import

import logging
import os

import tornado.ioloop
import tornado.options
import tornado.web


log = logging.getLogger(__name__)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('../../web/index.html', title='Raccoon - Deployment Tool', cdn='web')

class PingHandler(tornado.web.RequestHandler):
    def get(self):
        self.write({'ping': 'pong'})

class Application(tornado.web.Application):
    """
    Main Application
    """
    def __init__(self):
        settings = {
            'static_path': os.path.join(os.path.dirname(__file__), '../../web'),
            'debug': True,
        }

        handlers = [
            (r'/', MainHandler),
            (r'/ping', PingHandler),
            (r'/static/(.*)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
        ]

        tornado.web.Application.__init__(self, handlers, **settings)

        # show requests in stdout
        tornado.options.parse_command_line()

def main():
    app = Application()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()



if __name__ == '__main__':
    main()

