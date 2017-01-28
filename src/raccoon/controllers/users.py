import logging

import jwt
import bcrypt
from tornado import gen
from mongoengine.errors import NotUniqueError, InvalidDocumentError

from . import BaseController
from ..models import User
from ..settings import SECRET, LDAP_AUTH
from ..utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class UsersController(BaseController):
    """
    Users Controller
    """
    model = User

    @classmethod
    @gen.coroutine
    def post(cls, request, *args, **kwargs):
        if LDAP_AUTH:
            raise ReplyError(403)

        if not cls.model:
            raise ReplyError(404)

        params = {}
        for key, value in kwargs.items():
            if hasattr(cls.model, key) and key != "pk":
                params[key] = value

        password = params.pop('password', None)
        if not password:
            raise ReplyError(400)

        password = password.encode('utf-8')
        password = bcrypt.hashpw(password, bcrypt.gensalt())
        params['password'] = password.decode('utf-8')

        # if this is the first user make it admin
        try:
            cls.model.objects.get()
        except:
            params['role'] = 'admin'

        try:
            user = cls.model.objects.create(**params)
        except NotUniqueError as e:
            raise ReplyError(409, cls.model.get_message_from_exception(e))
        except InvalidDocumentError as e:
            raise ReplyError(400, cls.model.get_message_from_exception(e))

        token = jwt.encode({
            'id': str(user.pk),
            'role': user.role,
        }, SECRET, algorithm='HS256')
        request.send({
            'token': token.decode('utf8'),
            'userId': str(user.pk)
        })


class MeController(UsersController):
    model = User
