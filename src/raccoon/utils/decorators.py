import logging

import jwt
from tornado import gen

from settings import SECRET
from ..models import User
from .exceptions import ReplyError

log = logging.getLogger(__name__)


def authenticated(method):
    """Decorate methods with this to require that the user be logged in."""

    @gen.coroutine
    def wrapper(cls, request, *args, **kwargs):
        """
        Wrapper for the authenticated decorator.
        """
        if not request.token:
            raise ReplyError(401)

        try:
            user_data = jwt.decode(request.token, SECRET, algorithms=['HS256'])
        except jwt.exceptions.DecodeError:
            raise ReplyError(400)

        if not user_data.get('id'):
            raise ReplyError(401)

        request.user = yield User.objects.get(user_data['id'])
        if not request.user:
            raise ReplyError(401)

        result = yield method(cls, request, *args, **kwargs)
        raise gen.Return(result)
    return wrapper


def is_admin(method):
    """Decorate methods with this to require that the user is admin."""

    @gen.coroutine
    def wrapper(cls, request, *args, **kwargs):
        """
        Wrapper for the authenticated decorator.
        """
        if not request.token:
            raise ReplyError(401)

        try:
            user_data = jwt.decode(request.token, SECRET, algorithms=['HS256'])
        except jwt.exceptions.DecodeError:
            raise ReplyError(400)

        if user_data.get('role') != 'admin':
            raise ReplyError(401)

        result = yield method(cls, request, *args, **kwargs)
        raise gen.Return(result)
    return wrapper
