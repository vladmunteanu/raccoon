from __future__ import absolute_import

import json
import logging
import re

import tornado.web

from .controllers import *
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class Router(object):
    """
    Router
    """

    urlpatterns = [
        (r'^/api/v1/actions/(?P<id>[a-zA-Z0-9\-\_\.]*)$', ActionsController),
        (r'^/api/v1/auditlogs/(?P<id>[a-zA-Z0-9\-\_\.]*)$', AuditlogsController),
        (r'^/api/v1/builds/(?P<id>[a-zA-Z0-9\-\_\.]*)$', BuildsController),
        (r'^/api/v1/connectors/(?P<id>[a-zA-Z0-9\-\_\.]*)$', ConnectorsController),
        (r'^/api/v1/environments/(?P<id>[a-zA-Z0-9\-\_\.]*)$', EnvironmentsController),
        (r'^/api/v1/installs/(?P<id>[a-zA-Z0-9\-\_\.]*)$', InstallsController),
        (r'^/api/v1/methods/(?P<id>[a-zA-Z0-9\-\_\.]*)$', MethodsController),
        (r'^/api/v1/projects/(?P<id>[a-zA-Z0-9\-\_\.]*)$', ProjectsController),
        (r'^/api/v1/rights/(?P<id>[a-zA-Z0-9\-\_\.]*)$', RightsController),
        (r'^/api/v1/users/(?P<id>[a-zA-Z0-9\-\_\.]*)$', UsersController)
    ]

    def __init__(self):
        pass

    @classmethod
    def get(cls, url):
        for url_regex, handler in cls.urlpatterns:
            match = re.match(url_regex, url)
            if match:
                return handler, match.groupdict()

        raise ReplyError(404)
