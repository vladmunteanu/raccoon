from __future__ import absolute_import
import re

from .controllers import *
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class Router(object):
    """
    Router
    """

    urlpatterns = [
        (r'^/api/v1/auth/?$', AuthController),
        (r'^/api/v1/actions/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', ActionsController),
        (r'^/api/v1/auditlogs/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', AuditlogsController),
        (r'^/api/v1/builds/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', BuildsController),
        (r'^/api/v1/connectors/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', ConnectorsController),
        (r'^/api/v1/environments/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', EnvironmentsController),
        (r'^/api/v1/installs/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', InstallsController),
        (r'^/api/v1/jobs/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', JobsController),
        (r'^/api/v1/projects/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', ProjectsController),
        (r'^/api/v1/rights/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', RightsController),
        (r'^/api/v1/users/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', UsersController),
        (r'^/api/v1/flows/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', FlowsController),
        (r'^/api/v1/me/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', MeController),
        (r'^/api/v1/tasks/(?P<id>[a-zA-Z0-9\-\_\.]*)/?$', TasksController),


        # messaging
        (r'^/api/v1/notifications/(?P<method>[a-zA-Z\_]*)/?$', NotificationsController),

        # interfaces
        (r'^/api/v1/github/(?P<method>[a-zA-Z\_]*)/?$', GitHubController),
        (r'^/api/v1/jenkins/(?P<method>[a-zA-Z\_]*)/?$', JenkinsController),
    ]

    @classmethod
    def get(cls, url):
        for url_regex, handler in cls.urlpatterns:
            match = re.match(url_regex, url)
            if match:
                return handler, match.groupdict()

        raise ReplyError(404)
