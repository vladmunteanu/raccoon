import logging

from tornado import gen

from .exceptions import ReplyError

log = logging.getLogger(__name__)


def authenticated(method):
    """ Decorate methods with this to require that the user is logged in. """

    @gen.coroutine
    def wrapper(cls, request, *args, **kwargs):
        """ Wrapper for the authenticated decorator. """
        if not request.token or not request.user_data.get('id'):
            raise ReplyError(401)

        result = yield method(cls, request, *args, **kwargs)
        raise gen.Return(result)
    return wrapper


def is_admin(method):
    """ Decorate methods with this to require that the user is admin. """

    @gen.coroutine
    def wrapper(cls, request, *args, **kwargs):
        """ Wrapper for the is_admin decorator. """
        if not request.token or not request.is_admin:
            raise ReplyError(401)

        result = yield method(cls, request, *args, **kwargs)
        raise gen.Return(result)
    return wrapper
