from __future__ import absolute_import

import logging
import json

from tornado import gen
from tornado.httpclient import AsyncHTTPClient, HTTPRequest

log = logging.getLogger(__name__)

class BaseInterface(object):

    def __init__(self, connector):
        self.connector = connector
        self.HTTPClient = AsyncHTTPClient()

    @gen.coroutine
    def fetch(self, url, method='GET', body=None, headers=None):

        print ('******', url)

        response = yield self.HTTPClient.fetch(HTTPRequest(
            url=url,
            method=method,
            body=body,
            headers=headers,
            use_gzip=True,
            validate_cert=False,
        ))

        if response.body:
            response = json.loads(response.body.decode('utf-8'))

        raise gen.Return(response)
