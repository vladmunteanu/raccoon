import ssl
import json
import logging
import datetime
from urllib.parse import urlparse, urljoin

from tornado import gen
from tornado.ioloop import IOLoop
from tornado.httpclient import AsyncHTTPClient, HTTPRequest, HTTPError

from .long_polling import BaseLongPollingTask, READY_STATES, UNREADY_STATES
from .long_polling import PENDING, STARTED, SUCCESS, FAILURE, ABORTED
from ..utils.exceptions import RetryException, TaskAborted
from ..models.task import Task
from ..models.connector import Connector

log = logging.getLogger(__name__)


class JenkinsJobWatcherTask(BaseLongPollingTask):
    """
        Represents the Jenkins Job Watcher, periodically calling the API
     to determine the current status of a STARTED job.
        If the returned status is either SUCCESS or FAILURE,
    or if an error occurs, the task is finished and the task status updated.
        Clients are constantly notified about the task status.
    """

    def __init__(self, task, url=None, api_url=None, *args, **kwargs):
        super(JenkinsJobWatcherTask, self).__init__(task, *args, **kwargs)

        self.url = url
        self.api_url = api_url
        self.http_client = AsyncHTTPClient()

    @gen.coroutine
    def run(self):
        url = self.url
        api_url = self.api_url

        parsed_url = urlparse(url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        url = urljoin(api_url, path)

        try:
            result = yield self.http_client.fetch(HTTPRequest(
                url=url,
                method="GET",
                validate_cert=False,
            ))
        except HTTPError as exc:
            if exc.code >= 500:
                raise RetryException
            else:
                raise

        result_body = json.loads(result.body.decode('utf-8'))
        # Fetch console output
        console_output_url = '{}/consoleText/'.format(parsed_url.path.strip('/'))
        console_output_url = urljoin(api_url, console_output_url)
        try:
            console_output = yield self.http_client.fetch(HTTPRequest(
                url=console_output_url,
                method="GET",
                validate_cert=False,
            ))
        except ssl.SSLError:
            raise RetryException
        except HTTPError as exc:
            if exc.code >= 500:
                raise RetryException
            else:
                raise

        console_output = console_output.body.decode('utf-8')
        self.task.console_output = console_output

        self.task.status = result_body.get('result') or STARTED
        self.task.result = result_body

        if self.task.status == FAILURE:
            raise Exception("Jenkins job failed!")

        if self.task.status == ABORTED:
            raise TaskAborted

        if self.task.status not in READY_STATES + UNREADY_STATES:
            raise Exception("Invalid status value {}".format(self.task.status))

        if self.task.status == SUCCESS:
            raise gen.Return()

        # Notify clients about the Task progress
        self.task.save()
        self.notify_clients(extra={
            'started_at': result_body.get('timestamp'),
            'estimated_duration': result_body.get('estimatedDuration'),
            'result': result_body,
            'console_output': console_output
        })

        raise RetryException

    @gen.coroutine
    def on_success(self, result):
        """
            Called on status success to execute the task callback.
        :param result: task result
        :return: None
        """
        yield super(JenkinsJobWatcherTask, self).on_success(result)

        callback = self.task.callback
        if callback:
            yield callback(task=self.task, response=result)


class JenkinsQueueWatcherTask(BaseLongPollingTask):
    """
        Represents the Jenkins Queue Watcher, periodically calling the API
    to determine the current status of a PENDING job.
        When the job has been STARTED by Jenkins, a URL is provided in the
    executable field of the HTTP response body. This URL will be used to start
    a JenkinsJobWatcherTask instance.
    """

    def __init__(self, task, api_url=None, queue_url=None, *args, **kwargs):
        super(JenkinsQueueWatcherTask, self).__init__(task, *args, **kwargs)

        self.api_url = api_url
        self.queue_url = queue_url
        self.http_client = AsyncHTTPClient()

    @gen.coroutine
    def run(self):
        queue_url = self.queue_url
        api_url = self.api_url
        parsed_url = urlparse(queue_url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        queue_url = urljoin(api_url, path)

        try:
            result = yield self.http_client.fetch(HTTPRequest(
                url=queue_url,
                method="GET",
                validate_cert=False,
            ))
        except ssl.SSLError:
            raise RetryException
        except HTTPError as exc:
            if exc.code >= 500:
                raise RetryException
            else:
                raise

        result_body = json.loads(result.body.decode('utf-8'))

        self.task.status = PENDING
        self.task.result = result_body

        self.notify_clients(extra={'why': result_body.get('why')})

        build_url = result_body.get('executable', {}).get('url')
        if build_url:
            raise gen.Return(build_url)

        self.task.save()

        raise RetryException

    @gen.coroutine
    def on_success(self, result):
        """
            Called when the Jenkins Queue returns the executable url.
            Starts the Jenkins Job watcher.
        """
        next_task = JenkinsJobWatcherTask(self.task, countdown=self.countdown,
                                          url=result, api_url=self.api_url)
        yield next_task.delay()


def resume_ongoing_tasks():
    connector = Connector.objects.filter(type='jenkins').first()
    tasks = Task.objects.filter(status__in=list(UNREADY_STATES)).all()

    username = connector.config.get('username')
    token = connector.config.get('token')

    # compose the API url
    url = connector.config.get('url')
    url = urlparse(url)
    api_url = '{scheme}://{username}:{token}@{netloc}'.format(
        scheme=url.scheme,
        username=username,
        token=token,
        netloc=url.netloc,
    )

    # go through each unfinished task and start a job watcher
    for task in tasks:
        # start watching tasks that are already running on jenkins master
        if task.status == STARTED:
            log.info("Starting job watcher for unfinished, STARTED task!")
            watcher = JenkinsJobWatcherTask(task, countdown=5,
                                            url=task.result['url'],
                                            api_url=api_url)
        # start watching tasks that are marked as pending
        else:
            log.info(["Starting queue watcher for unfinished, PENDING task!"])
            # look for item in queue
            watcher = JenkinsQueueWatcherTask(task, countdown=5,
                                              queue_url=task.result['url'],
                                              api_url=api_url)
        IOLoop.current().add_timeout(
            datetime.timedelta(seconds=1),
            watcher.delay
        )
