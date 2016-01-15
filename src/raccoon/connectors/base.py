from __future__ import absolute_import

import logging

from tornado import gen
from tornado.httpclient import AsyncHTTPClient, HTTPRequest

log = logging.getLogger(__name__)

class BaseConnector(object):

    def __init__(self):
        self.HTTPClient = AsyncHTTPClient()

    @gen.coroutine
    def fetch(self, url, method='GET', headers=None):
        response = yield self.HTTPClient.fetch(HTTPRequest(
            url=url,
            method=method,
            headers=headers,
            use_gzip=True,
        ))

        raise gen.Return(response)
