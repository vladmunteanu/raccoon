import logging
import datetime
from urllib.parse import urlencode, urlparse, urljoin

from tornado import gen
from mongoengine.errors import DoesNotExist

from raccoon.external.interfaces import BaseInterface, REGISTERED
from raccoon.models import Task, Build, Project, Environment, Install, AuditLog
from raccoon.utils.exceptions import ReplyError
from raccoon.utils.request import broadcast
from raccoon.utils.utils import translate_job_arguments
from raccoon.tasks.jenkins import JenkinsQueueWatcherTask, PENDING


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
    def build(self, request, flow=None, job=None, *args, **kwargs):
        """
        Called by the Jenkins controller to perform a build job.
        Executes trigger with the modified context and build_callback
        for the task.

        :param request: client request
        :type request: raccoon.utils.request.Request
        :param flow: flow that triggered the build
        :type flow: raccoon.models.flow.Flow
        :param job: job information
        :type job: raccoon.models.job.Job
        :param args: arguments, passed to trigger
        :param kwargs: keyword args representing the context sent by the flow.
        :return: None
        """
        context = kwargs.copy()
        project_id = context.get('project', {}).get('id')
        version = context.get('version')
        branch = context.get('branch')

        # Get the project to build, and increment the build counter
        try:
            project = Project.objects.get(id=project_id)
        except DoesNotExist:
            raise ReplyError(404)

        project.version = version
        project.build_counter += 1
        project.save()

        # Create the new version and update the context with the correct values
        version += "-" + str(project.build_counter)

        context.update({
            'project': project.get_dict(),
            'version': version,
        })

        context.update({
            'job_arguments': translate_job_arguments(job.arguments, context)
        })

        # Notify clients about project changes.
        request.broadcast(
            project.get_dict(),
            verb='put', resource='/api/v1/projects/'
        )

        # Log build started
        user = request.user
        audit_log = AuditLog(
            user=user.email,
            action='build',
            project=project.name,
            message='Build {} started for branch {}.'.format(version, branch)
        )
        audit_log.save()

        request.broadcast(
            audit_log.get_dict(),
            verb='post', resource='/api/v1/auditlogs/',
            admin_only=True
        )

        # Trigger the job in Jenkins
        yield self.trigger(
            request, flow, callback_method=self.build_callback,
            *args, **context
        )

    @classmethod
    @gen.coroutine
    def build_callback(cls, task, response):
        """
        Passed to the Task object, this function represents the callback
        that will be executed when the task finishes successfully.
        Creates the Build object and broadcasts the change to all
        connected clients.

        :param task: Task object that was passed this callback.
        :type task: raccoon.models.task.Task
        :param response: The result of the task. Not used.
        :return: None
        """
        project_id = task.context.get('project', {}).get('id')
        branch = task.context.get('branch')
        version = task.context.get('version')

        # get project
        try:
            project = Project.objects.get(id=project_id)
        except DoesNotExist:
            raise ReplyError(404)

        # Get commits and create changelog
        changelog = yield project.connector.interface.commits(
            project=project, branch=branch
        )

        # Create the Build instance
        build = Build(
            project=project,
            task=task,
            branch=branch,
            version=version,
            changelog=changelog
        )
        build.save()

        # Notify clients about the new Build instance
        broadcast(build.get_dict(), verb='post', resource='/api/v1/builds/')

    @gen.coroutine
    def install(self, request, flow=None, job=None, *args, **kwargs):
        """
        Called by the Jenkins controller to perform an install job.
        Executes trigger with the modified context and install_callback
        for the task.

        :param request: client request
        :type request: raccoon.utils.request.Request
        :param flow: flow that triggered this install
        :type flow: raccoon.models.flow.Flow
        :param job: job with parameters and name of the Jenkins job
        :type job: raccoon.models.job.Job
        :param args: arguments, will be passed to trigger
        :param kwargs: keyword arguments representing the context
        :return: None
        """
        context = kwargs.copy()
        project_id = context.get('project', {}).get('id')
        build_id = context.get('build_id')
        environment_id = context.get('environment', {}).get('id')

        # Get Project, Environment and Build to con
        try:
            project = Project.objects.get(id=project_id)
        except DoesNotExist:
            raise ReplyError(404)

        try:
            environment = Environment.objects.get(id=environment_id)
        except DoesNotExist:
            raise ReplyError(404)

        # Check the associated build
        try:
            build = Build.objects.get(id=build_id)
        except DoesNotExist:
            raise ReplyError(404)

        # Replace placeholders in Job arguments that are found in context
        context.update({
            'job_arguments': translate_job_arguments(job.arguments, context)
        })

        # Log the install
        user = request.user
        audit_log = AuditLog(
            user=user.email,
            action='install',
            project=project.name,
            environment=environment.name,
            message='Install started for build {}'.format(build.version)
        )
        audit_log.save()

        request.broadcast(
            audit_log.get_dict(),
            verb='post', resource='/api/v1/auditlogs/',
            admin_only=True
        )

        # Trigger the Jenkins job
        yield self.trigger(
            request, flow, callback_method=self.install_callback,
            *args, **context
        )

    @classmethod
    @gen.coroutine
    def install_callback(cls, task, response):
        """
        Passed to the Task object, this function represents the callback
        that will be executed when the task finishes successfully.
        Creates the Install object and broadcasts the change to all
        connected clients.

        :param task: Task object that was passed this callback.
        :type task: raccoon.models.task.Task
        :param response: The result of the task.
        :return: None
        """
        project_id = task.context.get('project', {}).get('id')
        build_id = task.context.get('build_id')
        env_id = task.context.get('environment', {}).get('id')

        # Get Project, Build and Environment to create the Install object
        try:
            project = Project.objects.get(id=project_id)
        except DoesNotExist:
            raise ReplyError(404)

        try:
            build = Build.objects.get(id=build_id)
        except DoesNotExist:
            raise ReplyError(404)

        try:
            env = Environment.objects.get(id=env_id)
        except DoesNotExist:
            raise ReplyError(404)

        install = Install(
            build=build, project=project,
            environment=env, task=task
        )
        install.save()

        # Notify clients about the new Install
        broadcast(install.get_dict(), verb='post', resource='/api/v1/installs/')

    @gen.coroutine
    def trigger(self, request, flow, callback_method=None, *args, **kwargs):
        """
        Triggers the job in Jenkins by collecting the job name from flow
        and job arguments from the context generated by that flow.
        Builds the URL for the Jenkins API and performs the HTTP call,
        creates and starts the watcher tasks for the current job.

        If everything works OK, the client receives a 201 HTTP code.

        :param request: HTTP request
        :type request: raccoon.utils.request.Request
        :param flow: Flow
        :type flow: raccoon.models.flow.Flow
        :param callback_method: callback method assigned to Task
        :param kwargs: parameters for jenkins job
        """
        # Get the verb and path for this job, according to Jenkins API URLs
        verb, path = URLS.get('build')
        if kwargs:
            verb, path = URLS.get('build_with_params')

        # Create URL with parameters
        job_name = flow.job.job
        query = urlencode(kwargs.get('job_arguments'))
        url = urljoin(self.api_url, path).format(
            job_name=job_name,
        )
        url = '{}?{}'.format(url, query)

        # Call Jenkins API to schedule the task
        body, headers = yield self.fetch(
            method=verb,
            url=url,
        )

        task = Task(
            connector_type='jenkins',
            action_type=flow.job.action_type,
            user=request.user,
            job=flow.job,
            context=kwargs,
            status=PENDING,
            date_added=datetime.datetime.utcnow(),
            environment=kwargs.get('environment', {}).get('id'),
            project=kwargs.get('project', {}).get('id')
        )
        task.add_callback(callback_method)
        task.save()

        # Start local Jenkins watcher jobs
        # Get queue URL from Jenkins response headers
        queue_url = headers.get('Location')
        job_watcher = JenkinsQueueWatcherTask(
            task, countdown=5, api_url=self.api_url, queue_url=queue_url
        )
        yield job_watcher.delay()

        # broadcast the Task object to all connected clients
        request.broadcast(
            task.get_dict(),
            verb='post', resource='/api/v1/tasks/'
        )

        raise ReplyError(201)

    @gen.coroutine
    def generic(self, request, flow=None, job=None, *args, **kwargs):
        """
        Runs a generic job, starting the queue watcher and job watcher
        tasks.

        :param request: HTTP request
        :type request: raccoon.utils.request.Request
        :param flow: Flow object
        :type flow: raccoon.models.flow.Flow
        :param job: Job object
        :type job: raccoon.models.job.Job
        :param kwargs: parameters for jenkins job
        """
        context = kwargs.copy()
        context.update({
            'job_arguments': translate_job_arguments(job.arguments, context)
        })

        yield self.trigger(request, flow, *args, **context)

    @gen.coroutine
    def jobs(self, *args, **kwargs):
        """
        Retrieves the Jenkins Jobs from the API.

        :param args: not used.
        :param kwargs: not used.
        :return: jobs
        """
        # Get the API URL from Jenkins URLs
        verb, path = URLS.get('jobs')
        url = urljoin(self.api_url, path)

        # Fetch the jobs from Jenkins API
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

    @gen.coroutine
    def stop(self, request, task_id, flow=None, job=None, *args, **kwargs):
        verb, path = URLS.get('stop')
        url = urljoin(self.api_url, path).format(
            job_name=job.job,
            **kwargs
        )

        try:
            task = Task.objects.get(id=task_id)
        except DoesNotExist:
            raise ReplyError(404)

        if (
            not request.is_admin
            and request.user_data.get('id') != str(task.user.id)
        ):
            raise ReplyError(401)

        response, headers = yield self.fetch(
            method=verb,
            url=url,
            follow_redirects=False,
        )

        raise gen.Return(response)

    def __getattr__(self, method):
        return lambda *args, **kwargs: self.call(method, *args, **kwargs)


REGISTERED['jenkins'] = JenkinsInterface
