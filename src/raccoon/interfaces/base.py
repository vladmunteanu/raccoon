from __future__ import absolute_import

import logging
import json

from tornado import gen
from tornado.httpclient import AsyncHTTPClient, HTTPRequest, HTTPError

from raccoon.utils.exceptions import ReplyError


log = logging.getLogger(__name__)

REGISTERED = {}

class BaseInterface(object):

    def __init__(self, connector):
        self.connector = connector
        self.HTTPClient = AsyncHTTPClient()

    @gen.coroutine
    def fetch(self, url, method='GET', body=None, headers=None, follow_redirects=True, auth_username=None, auth_password=None):
        body = body or 'no body' if method.upper() == 'POST' else None
        log.info(['BaseInterface.fetch', method, url])

        try:
            response = yield self.HTTPClient.fetch(HTTPRequest(
                url=url,
                method=method,
                body=body,
                headers=headers,
                follow_redirects=follow_redirects,
                use_gzip=True,
                validate_cert=False,
                auth_username=auth_username,
                auth_password=auth_password,
            ))
        except HTTPError as exc:
            raise ReplyError(exc.code, exc.message)
        except Exception as exc:
            log.error(exc)
            raise ReplyError(500, exc.message)
        else:
            body = response.body
            headers = response.headers

            content_type = headers.get('Content-Type')
            if content_type and 'application/json' in content_type:
                body = json.loads(response.body.decode('utf-8'))

            raise gen.Return((body, headers))
