from __future__ import absolute_import
import re

from .controllers import *
from .utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class Router(object):
    """
    Router
    """

    urlpatterns = [
        (r'^/api/v1/auth/?$', AuthController),
        (r'^/api/v1/actions(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', ActionsController),
        (r'^/api/v1/auditlogs(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', AuditlogsController),
        (r'^/api/v1/builds(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', BuildsController),
        (r'^/api/v1/connectors(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', ConnectorsController),
        (r'^/api/v1/environments(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', EnvironmentsController),
        (r'^/api/v1/installs(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', InstallsController),
        (r'^/api/v1/jobs(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', JobsController),
        (r'^/api/v1/projects(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', ProjectsController),
        (r'^/api/v1/rights(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', RightsController),
        (r'^/api/v1/users(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', UsersController),
        (r'^/api/v1/flows(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', FlowsController),
        (r'^/api/v1/me(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', MeController),
        (r'^/api/v1/tasks(/?(?P<pk>[a-zA-Z0-9\-\_\.]*))/?$', TasksController),

        # messaging
        (r'^/api/v1/notifications(/?(?P<method>[a-zA-Z\_]*))/?$', NotificationsController),

        # interfaces
        (r'^/api/v1/github(/?(?P<method>[a-zA-Z\_]*))/?$', GitHubController),
        (r'^/api/v1/bitbucket(/?(?P<method>[a-zA-Z\_]*))/?$', BitbucketController),
        (r'^/api/v1/jenkins(/?(?P<method>[a-zA-Z\_]*))/?$', JenkinsController),
    ]

    @classmethod
    def get(cls, url):
        for url_regex, handler in cls.urlpatterns:
            match = re.match(url_regex, url)
            if match:
                return handler, match.groupdict()

        raise ReplyError(404)
