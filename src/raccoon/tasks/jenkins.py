import json
import logging
from urllib.parse import urlparse, urljoin

from tornado import gen
from tornado.httpclient import AsyncHTTPClient, HTTPRequest

from ..utils.exceptions import RetryException
from .long_polling import BaseLongPollingTask, STARTED, PENDING
from .long_polling import SUCCESS, FAILURE, READY_STATES, UNREADY_STATES

log = logging.getLogger(__name__)


class JenkinsJobWatcherTask(BaseLongPollingTask):

    def __init__(self, task, url=None, api_url=None, *args, **kwargs):
        super(JenkinsJobWatcherTask, self).__init__(task, *args, **kwargs)

        self.url = url
        self.api_url = api_url

    @gen.coroutine
    def run(self):
        url = self.url
        api_url = self.api_url

        parsed_url = urlparse(url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        url = urljoin(api_url, path)

        result = yield AsyncHTTPClient().fetch(HTTPRequest(
            url=url,
            method="GET",
            validate_cert=False,
        ))
        result_body = json.loads(result.body.decode('utf-8'))

        # Fetch console output
        console_output_url = '{}/consoleText/'.format(parsed_url.path.strip('/'))
        console_output_url = urljoin(api_url, console_output_url)
        console_output = yield AsyncHTTPClient().fetch(HTTPRequest(
            url=console_output_url,
            method="GET",
            validate_cert=False,
        ))
        console_output = console_output.body.decode('utf-8')
        self.task.console_output = console_output

        self.task.status = result_body.get('result') or STARTED
        self.task.result = result_body

        if self.task.status == FAILURE:
            raise Exception("Jenkins job failed!")

        if self.task.status not in READY_STATES + UNREADY_STATES:
            raise Exception("Invalid status value {}".format(self.task.status))

        if self.task.status == SUCCESS:
            raise gen.Return()

        # Notify clients about the Task progress
        yield self.task.save()
        self.notify_clients(extra={
            'started_at': result_body.get('timestamp'),
            'estimated_duration': result_body.get('estimatedDuration'),
            'result': result_body,
            'console_output': console_output
        })

        raise RetryException

    @gen.coroutine
    def on_success(self, result):
        callback = self.task.callback
        if callback:
            yield callback(task=self.task, response=result)

        yield super(JenkinsJobWatcherTask, self).on_success(result)


class JenkinsQueueWatcherTask(BaseLongPollingTask):

    def __init__(self, task, api_url=None, queue_url=None, *args, **kwargs):
        super(JenkinsQueueWatcherTask, self).__init__(task, *args, **kwargs)

        self.api_url = api_url
        self.queue_url = queue_url

    @gen.coroutine
    def run(self):
        queue_url = self.queue_url
        api_url = self.api_url
        parsed_url = urlparse(queue_url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        queue_url = urljoin(api_url, path)

        result = yield AsyncHTTPClient().fetch(HTTPRequest(
            url=queue_url,
            method="GET",
            validate_cert=False,
        ))
        result_body = json.loads(result.body.decode('utf-8'))

        self.task.status = PENDING
        self.task.result = result_body

        self.notify_clients(extra={'why': result_body.get('why')})

        build_url = result_body.get('executable', {}).get('url')
        if build_url:
            raise gen.Return(build_url)

        yield self.task.save()

        raise RetryException

    @gen.coroutine
    def on_success(self, result):
        next_task = JenkinsJobWatcherTask(self.task, countdown=self.countdown,
                                          url=result, api_url=self.api_url)
        yield next_task.delay()
