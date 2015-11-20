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
        (r'^/api/v1/projects/$', ProjectsController),
    ]

    def __init__(self):
        pass

    @classmethod
    def get(cls, url):
        for url_regex, handler in cls.urlpatterns:
            if re.match(url_regex, url):
                return handler

        raise ReplyError(404)
