from __future__ import absolute_import

import logging
from tornado import gen
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)

class BaseController(object):
    """
    Base Controller
    """
    model = None

    @classmethod
    @gen.coroutine
    def get(cls, id=None, *args, **kwargs):
        if not cls.model:
            raise NotImplemented

        if id:
            response = yield cls.model.objects.get(id=id)
            if not response:
                raise ReplyError(404)

            response = response.to_son()
        else:
            response = yield cls.model.objects.find_all()
            response = [r.to_son() for r in response]

        raise gen.Return(response)

    @classmethod
    @gen.coroutine
    def post(cls, *args, **kwargs):
        pass

    @classmethod
    @gen.coroutine
    def put(cls, *args, **kwargs):
        pass

    @classmethod
    @gen.coroutine
    def patch(cls, *args, **kwargs):
        pass

    @classmethod
    @gen.coroutine
    def delete(cls, *args, **kwargs):
        pass
