import jwt
from tornado import gen

from settings import SECRET
from raccoon.models import User
from raccoon.utils.exceptions import ReplyError


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
            userData = jwt.decode(request.token, SECRET, algorithms=['HS256'])
        except jwt.exceptions.DecodeError:
            raise ReplyError(400)

        if 'id' not in userData:
            raise ReplyError(401)

        request.user = yield User.objects.get(userData['id'])
        if not request.user:
            raise ReplyError(401)

        result = yield method(cls, request, *args, **kwargs)
        raise gen.Return(result)
    return wrapper


def isAdmin(method):
    """Decorate methods with this to require that the user is admin."""

    @gen.coroutine
    def wrapper(cls, request, *args, **kwargs):
        """
        Wrapper for the authenticated decorator.
        """
        if not request.token:
            raise ReplyError(401)

        try:
            userData = jwt.decode(request.token, SECRET, algorithms=['HS256'])
        except jwt.exceptions.DecodeError:
            raise ReplyError(400)

        if userData.get('role') != 'admin':
            raise ReplyError(401)

        result = yield method(cls, request, *args, **kwargs)
        raise gen.Return(result)
    return wrapper
