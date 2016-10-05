from __future__ import absolute_import

import logging
from urllib.parse import urlencode, urlparse, urljoin

from tornado import gen

from .base import BaseInterface, REGISTERED
from ..models import Task, Build, Project, Environment, Install
from ..utils.exceptions import ReplyError


log = logging.getLogger(__name__)

URL_END = '/api/json'
URLS = {
    'build': ('POST', 'job/{job_name}/build' + URL_END),
    'build_with_params': ('POST', 'job/{job_name}/buildWithParameters' + URL_END),
    'stop': ('POST', 'job/{job_name}/{build_number}/stop' + URL_END),
    'build_info': ('GET', 'job/{job_name}/{build_number}' + URL_END),
    'build_output': ('GET', 'job/{job_name}/{build_number}/consoleText' + URL_END),
    'build_last': ('GET', 'job/{job_name}/lastBuild' + URL_END),
    'queue_info': ('GET', 'queue/item/{queue_number}' + URL_END),
    'jobs': ('GET', URL_END),
}


class JenkinsInterface(BaseInterface):
    """
    curl -vkX POST 'https://%USER%:%TOKEN%@%HOST%/job/%JOB_NAME%/buildWithParameters/api/json?%PARAMS%'
    """
    tasks = None

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
    def build(self, request, *args, **kwargs):
        project_id = kwargs.get('project')
        version = kwargs.get('version')

        project = yield Project.objects.get(id=project_id)
        if not project:
            raise ReplyError(404)

        # update project
        project.version = version
        project.build_counter += 1
        yield project.save()

        # send notification for project
        request.verb = "put"
        request.resource = "/api/v1/projects/"
        request.broadcast(project.get_dict())

        version = version + "-" + str(project.build_counter)
        kwargs.update({'version': version})
        yield self.trigger(request, callback_method=self.build_callback, *args, **kwargs)

    @classmethod
    @gen.coroutine
    def build_callback(cls, request, task, response):
        project_id = task.context.get('project')
        branch_name = task.context.get('branch')
        version = task.context.get('version')

        # get project
        project = yield Project.objects.get(id=project_id)
        if not project:
            raise ReplyError(404)

        # load project references
        yield project.load_references()

        # get commits and create changelog
        changelog = yield project.connector.interface.commits(project=project, branch=branch_name)

        # create build
        build = Build(
            project=project.pk,
            branch=branch_name,
            version=version,
            changelog=changelog,
        )
        yield build.save()

        request.verb = 'post'
        request.resource = '/api/v1/builds/'
        request.broadcast(build.get_dict())

    @gen.coroutine
    def install(self, request, *args, **kwargs):
        yield self.trigger(request, callback_method=self.install_callback,
                           *args, **kwargs)

    @classmethod
    @gen.coroutine
    def install_callback(cls, request, task, response):
        project_id = task.context.get('project')
        build_id = task.context.get('build')
        env_id = task.context.get('environment')

        # get project
        project = yield Project.objects.get(id=project_id)
        if not project:
            raise ReplyError(404)

        # get build
        build = yield Build.objects.get(id=build_id)
        if not build:
            raise ReplyError(404)

        # get env
        env = yield Environment.objects.get(name=env_id)
        if not env:
            raise ReplyError(404)

        install = Install(build=build, project=project, environment=env)
        yield install.save()

        request.verb = 'post'
        request.resource = '/api/v1/installs/'
        request.broadcast(install.get_dict())

    @gen.coroutine
    def trigger(self, request, flow, callback_method=None, *args, **kwargs):
        """
        :param kwargs: parameter for jenkins job
        :return: Build information
        """
        verb, path = URLS.get('build')
        if kwargs:
            verb, path = URLS.get('build_with_params')

        job_name = flow.job.job

        # create arguments
        arguments = {}
        for argument in flow.job.arguments:
            # convert argument to string b/c json decode might return int
            value = str(argument['value'])
            if value.startswith('$'):
                value = kwargs.get(value[1:], value)
            arguments[argument['name']] = value

        # create url with params
        query = urlencode(arguments)
        url = urljoin(self.api_url, path).format(
            job_name=job_name,
        )
        url = '{}?{}'.format(url, query)

        body, headers = yield self.fetch(
            method=verb,
            url=url,
        )

        # get queue info
        queue_url = headers.get('Location')

        task = Task(
            user=request.user,
            connector_type='jenkins',
            job=flow.job,
            context=kwargs,
        )
        task.add_callback(callback_method)
        yield task.save()

        chain = self.tasks.jenkins_queue_watcher.s(id=task.pk,
                                                   api_url=self.api_url,
                                                   url=queue_url)
        chain = chain | self.tasks.jenkins_job_watcher.s(id=task.pk,
                                                         api_url=self.api_url)

        chain_task = chain.delay()

        task.tasks = [chain_task.id, chain_task.parent.id]
        yield task.save()

        # broadcast
        # TODO (alexm): do something with this hack
        request.request_id = 'notification'
        request.verb = 'post'
        request.resource = '/api/v1/tasks/'
        request.broadcast(task.get_dict())

        raise ReplyError(201)

    @gen.coroutine
    def jobs(self, *args, **kwargs):
        verb, path = URLS.get('jobs')
        url = urljoin(self.api_url, path)

        response, headers = yield self.fetch(
            method=verb,
            url=url,
        )

        raise gen.Return(response['jobs'])

    @gen.coroutine
    def call(self, method, flow=None, job=None, *args, **kwargs):
        if method not in URLS:
            raise ReplyError(404)

        # select job from flow method
        job_name = None
        if flow:
            job_name = flow.job.job
        if job:
            job_name = job.job

        # select path
        verb, path = URLS.get(method)
        url = urljoin(self.api_url, path).format(
            job_name=job_name,
            **kwargs
        )

        response, headers = yield self.fetch(
            method=verb,
            url=url,
            follow_redirects=False,
        )

        raise gen.Return(response)

    def __getattr__(self, method):
        return lambda *args, **kwargs: self.call(method, *args, **kwargs)


REGISTERED['jenkins'] = JenkinsInterface
