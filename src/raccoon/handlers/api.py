from __future__ import absolute_import

import logging

import tornado.web


log = logging.getLogger(__name__)

class ApiHandler(tornado.web.RequestHandler):
    def get(self, request_url):
        self.write({'ping': 'pong'})