from __future__ import absolute_import

import logging
from tornado import gen
from motorengine.errors import UniqueKeyViolationError, InvalidDocumentError

from raccoon.utils.decorators import authenticated
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)

class BaseController(object):
    """
    Base Controller
    """
    model = None

    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, id=None, *args, **kwargs):
        if not cls.model:
            raise ReplyError(501)

        if id:
            response = yield cls.model.objects.get(id=id)
            if not response:
                raise ReplyError(404)

            response = response.to_json()
        else:
            response = yield cls.model.objects.find_all()
            response = [r.to_json() for r in response]

        yield request.send(response)

    @classmethod
    @gen.coroutine
    def post(cls, request, *args, **kwargs):
        if not cls.model:
            raise ReplyError(404)

        params = {}
        for key, value in kwargs.items():
            if hasattr(cls.model, key):
                params[key] = value

        try:
            response = yield cls.model.objects.create(**params)
            print(vars(response))
        except UniqueKeyViolationError:
            raise ReplyError(409)
        except InvalidDocumentError:
            raise ReplyError(400)

        yield request.send(response.to_json())

    @classmethod
    @gen.coroutine
    def put(cls, request, id, *args, **kwargs):
        if not cls.model:
            raise ReplyError(404)

        if not id:
            raise ReplyError(400)

        instance = yield cls.model.objects.get(id=id)
        if not instance:
            raise ReplyError(404)

        for key, value in kwargs.items():
            if hasattr(instance, key):
                setattr(instance, key, value)

        try:
            response = yield instance.save()
        except UniqueKeyViolationError:
            raise ReplyError(409)
        except InvalidDocumentError:
            raise ReplyError(400)

        yield request.send(response.to_json())

    @classmethod
    @gen.coroutine
    def patch(cls, *args, **kwargs):
        raise ReplyError(501)

    @classmethod
    @gen.coroutine
    def delete(cls, *args, **kwargs):
        raise ReplyError(501)
