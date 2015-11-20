from __future__ import absolute_import

import logging


log = logging.getLogger(__name__)

class BaseController(object):
    """
    Base Controller
    """

    @classmethod
    def get(self, *args, **kwargs):
        pass

    @classmethod
    def post(self, *args, **kwargs):
        pass

    @classmethod
    def put(self, *args, **kwargs):
        pass

    @classmethod
    def patch(self, *args, **kwargs):
        pass

    @classmethod
    def delete(self, *args, **kwargs):
        pass
