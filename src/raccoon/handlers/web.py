from __future__ import absolute_import

import logging

import tornado.web


log = logging.getLogger(__name__)

class WebHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        self.render('index.html', title='Raccoon - Deployment Tool', cdn='web')
