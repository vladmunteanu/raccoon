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
        (r'^/api/v1/projects/(?P<id>[a-zA-Z0-9\-\_\.]*)$', ProjectsController),
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
