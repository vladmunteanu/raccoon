import json
import logging

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
    def fetch(self, url, method='GET', body=None, headers=None, timeout=15,
              follow_redirects=True, auth_username=None, auth_password=None,
              connection_timeout=5):
        """
        Perform and asynchronous HTTP request, deserialize the response
        body as JSON and return tuple of body and headers.

        :param url: HTTP url
        :param method: HTTP method
        :param body: HTTP body
        :param headers: HTTP headers
        :param timeout: request timeout
        :param follow_redirects: request follow redirects
        :param auth_username: Authentication username
        :param auth_password: Authentication password
        :param connection_timeout: Number of seconds to wait for a connection
        :return: tuple of JSON body and headers
        :rtype: tuple
        """
        body = body or 'no body' if method.upper() == 'POST' else None

        try:
            response = yield self.HTTPClient.fetch(
                HTTPRequest(
                    url=url,
                    method=method,
                    body=body,
                    headers=headers,
                    follow_redirects=follow_redirects,
                    use_gzip=True,
                    validate_cert=False,
                    auth_username=auth_username,
                    auth_password=auth_password,
                    request_timeout=timeout,
                    connect_timeout=connection_timeout
                )
            )
        except HTTPError as exc:
            raise ReplyError(exc.code, str(exc))
        except Exception as exc:
            log.error(exc)
            raise ReplyError(500, str(exc))
        else:
            body = response.body
            headers = response.headers

            content_type = headers.get('Content-Type')
            if content_type and 'application/json' in content_type:
                body = json.loads(response.body.decode('utf-8'))

            raise gen.Return((body, headers))
