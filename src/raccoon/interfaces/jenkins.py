from __future__ import absolute_import

import logging
import re
from urllib.parse import urlencode, urlparse, urljoin

from tornado import gen

from .base import BaseInterface


log = logging.getLogger(__name__)

URL_END = '/api/json'
URLS = {
    'build': 'job/{job_name}/build' + URL_END,
    'build_with_params':'job/{job_name}/buildWithParameters' + URL_END,
    'build_stop': 'job/{job_name}/{build_number}/stop' + URL_END,
    'build_info': 'job/{job_name}/{build_number}' + URL_END,
    'job_output': 'job/{job_name}/consoleText' + URL_END,
}

class JenkinsInterface(BaseInterface):
    """
    curl -vkX POST 'https://%USER%:%TOKEN%@%HOST%/job/%JOB_NAME%/buildWithParameters/api/json?%PARAMS%'
    """

    def __init__(self, connector):
        super().__init__(connector)

        self.username = connector.config.get('username')
        self.token = connector.config.get('token')

        # compose the API url
        url = connector.config.get('url')
        url = urlparse(url)
        self.api_url = '{scheme}://{username}:{token}@{netloc}'.format(
            scheme=url.scheme,
            username=self.username,
            token=self.token,
            netloc=url.netloc,
        )

    @gen.coroutine
    def build(self, *args, **kwargs):
        path = URLS.get('build')
        if kwargs:
            path = URLS.get('build_with_params')

        query = urlencode(kwargs)

        # create url with params
        url = urljoin(self.api_url, path).format(
            job_name='Webserver-Unit-Tests'
        )
        url = '{}?{}'.format(url, query)

        body, headers = yield self.fetch(
            method='POST',
            url=url,
        )

        # get build info
        url = headers.get('Location')
        parsed_url = urlparse(url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        url = urljoin(self.api_url, path)

        response, headers = yield self.fetch(
            method='GET',
            url=url,
        )

        print ('==========> response', response)
        print ('==========> headers', headers)

        raise gen.Return(response)
