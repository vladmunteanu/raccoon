from __future__ import absolute_import

import logging
from tornado import gen

log = logging.getLogger(__name__)

class BaseController(object):
    """
    Base Controller
    """

    @classmethod
    @gen.coroutine
    def get(self, *args, **kwargs):
        pass

    @classmethod
    @gen.coroutine
    def post(self, *args, **kwargs):
        pass

    @classmethod
    @gen.coroutine
    def put(self, *args, **kwargs):
        pass

    @classmethod
    @gen.coroutine
    def patch(self, *args, **kwargs):
        pass

    @classmethod
    @gen.coroutine
    def delete(self, *args, **kwargs):
        pass
