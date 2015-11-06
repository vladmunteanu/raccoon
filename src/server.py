import os

import tornado.ioloop
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('../web/index.html', title='Raccoon - Deployment Tool', cdn='web')

class PingHandler(tornado.web.RequestHandler):
    def get(self):
        self.write({'ping': 'pong'})

settings = {
    'static_path': os.path.join(os.path.dirname(__file__), '../web'),
    'debug': True,
}

application = tornado.web.Application([
    (r'/', MainHandler),
    (r'/ping', PingHandler),
    (r'/static/(.*)', tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
], **settings)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.current().start()
