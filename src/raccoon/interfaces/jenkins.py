from __future__ import absolute_import

import logging
from urllib.parse import urlencode, urlparse, urljoin

from tornado import gen

from .base import BaseInterface
from raccoon.models import Task
from raccoon.utils.exceptions import ReplyError
from raccoon.tasks import tasks


log = logging.getLogger(__name__)

URL_END = '/api/json'
URLS = {
    'build': 'job/{job_name}/build' + URL_END,
    'build_with_params': 'job/{job_name}/buildWithParameters' + URL_END,
    'build_stop': 'job/{job_name}/{build_number}/stop' + URL_END,
    'build_info': 'job/{job_name}/{build_number}' + URL_END,
    'build_output': 'job/{job_name}/{build_number}/consoleText' + URL_END,
    'build_last': 'job/{job_name}/lastBuild' + URL_END,
    'queue_info': 'queue/item/{queue_number}' + URL_END,
    'jobs': '' + URL_END,
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
        log.info(['alexm: Jenkins.build', args, kwargs])
        yield self.trigger(*args, **kwargs)

    @gen.coroutine
    def install(self, *args, **kwargs):
        log.info(['alexm: Jenkins.install', args, kwargs])
        yield self.trigger(*args, **kwargs)

    @gen.coroutine
    def trigger(self, request, flow, *args, **kwargs):
        """
        :param kwargs: parameter for jenkins job
        :return: Build information
        """
        path = URLS.get('build')
        if kwargs:
            path = URLS.get('build_with_params')

        job_name = flow.job.job

        # create arguments
        arguments = {}
        for argument in flow.job.arguments:
            # convert argument to string b/c json decode might return int
            value = str(argument['value'])
            if value.startswith('$'):
                value = kwargs.get(value[1:]) if kwargs.get(value[1:]) else value
            arguments[argument['name']] = value

        # create url with params
        query = urlencode(arguments)
        url = urljoin(self.api_url, path).format(
            job_name=job_name,
        )
        url = '{}?{}'.format(url, query)

        body, headers = yield self.fetch(
            method='POST',
            url=url,
        )

        # get queue info
        queue_url = headers.get('Location')

        task = yield Task(user=request.user, job=flow.job, context=kwargs).save()
        chain = \
            tasks.jenkins_queue_watcher.s(id=task._id, api_url=self.api_url, url=queue_url) | \
            tasks.jenkins_job_watcher.s(id=task._id, api_url=self.api_url)
        chain_task = chain.delay()

        task.tasks = [chain_task.id, chain_task.parent.id]
        yield task.save()

        # broadcast
        # TODO (alexm): do something with this hack
        request.requestId = None
        request.verb = 'post'
        request.resource = '/api/v1/tasks/'
        request.broadcast(task.get_dict())

        raise ReplyError(201)

    # CELERY task
    # @gen.coroutine
    # def queue_info(self, url, *args, **kwargs):
    #     """
    #     :param url: URL for the queued task
    #     :return: information about the task that will be executed
    #     """
    #     parsed_url = urlparse(url)
    #     path = '{}/api/json'.format(parsed_url.path.strip('/'))
    #     url = urljoin(self.api_url, path)
    #
    #     response, headers = yield self.fetch(
    #         method='GET',
    #         url=url,
    #     )
    #
    #     raise gen.Return(response)

    @gen.coroutine
    def jobs(self, *args, **kwargs):
        path = URLS.get('jobs')
        url = urljoin(self.api_url, path)

        response, headers = yield self.fetch(
            method='GET',
            url=url,
        )

        raise gen.Return(response['jobs'])

    @gen.coroutine
    def call(self, method, flow=None, *args, **kwargs):
        if method not in URLS:
            raise ReplyError(404)

        # select job from flow method
        if flow:
            job_name = flow.job.job

        # select path
        path = URLS.get(method)
        url = urljoin(self.api_url, path).format(
            job_name=job_name,
            **kwargs
        )

        response, headers = yield self.fetch(
            method='GET',
            url=url,
        )

        raise gen.Return(response)

    def __getattr__(self, method):
        return lambda *args, **kwargs: self.call(method, *args, **kwargs)
