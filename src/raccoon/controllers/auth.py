from __future__ import absolute_import

import jwt
import logging
from settings import SECRET
from tornado import gen

from raccoon.controllers.base import BaseController
from raccoon.models import User
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class AuthController(BaseController):
    """
    Projects Controller
    """
    model = User

    @classmethod
    @gen.coroutine
    def get(cls, request, id=None, *args, **kwargs):
        raise ReplyError(501)

    @classmethod
    @gen.coroutine
    def post(cls, request, username, password, **kwargs):
        if not username or not password:
            raise ReplyError(400)

        user = yield cls.model.objects.get(username=username, password=password)
        if not user:
            raise ReplyError(404)

        token = jwt.encode({'id': str(user._id)}, SECRET, algorithm='HS256')
        yield request.send({'token': token.decode('utf8'), 'userId': str(user._id)})

    @classmethod
    @gen.coroutine
    def put(cls, request, *args, **kwargs):
        raise ReplyError(501)

    @classmethod
    @gen.coroutine
    def patch(cls, *args, **kwargs):
        raise ReplyError(501)

    @classmethod
    @gen.coroutine
    def delete(cls, *args, **kwargs):
        raise ReplyError(501)
