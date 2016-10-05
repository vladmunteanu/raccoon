from __future__ import absolute_import

import logging

import jwt
from tornado import gen
from ldap3 import Server, Connection, ALL, AUTH_SIMPLE
from ldap3.core.exceptions import LDAPBindError

from ..settings import SECRET, LDAP_AUTH, LDAP_CONF
from .base import BaseController
from ..models import User
from ..utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class AuthController(BaseController):
    """
    Auth Controller
    """
    model = User

    @classmethod
    @gen.coroutine
    def get(cls, request, pk=None, *args, **kwargs):
        raise ReplyError(501)

    @classmethod
    @gen.coroutine
    def post(cls, request, email=None, password=None, **kwargs):
        if not email or not password:
            raise ReplyError(400, 'Invalid email or password')

        if LDAP_AUTH:
            try:
                server = Server(LDAP_CONF['uri'], port=LDAP_CONF['port'],
                                get_info=ALL)
                conn = Connection(server, authentication=AUTH_SIMPLE,
                                  user=email, password=password, auto_bind=True)
                conn.search(search_base='DC=ad,DC=avira,DC=com',
                            search_filter='(userPrincipalName=%s)' % email,
                            attributes=['displayName'])
                name = str(conn.entries[0].displayName)
            except LDAPBindError:
                raise ReplyError(404, 'LDAP invalid credentials')
            except:
                raise ReplyError(500, 'LDAP server error')

            user = yield cls.model.objects.get(email=email)
            if not user:
                user = yield cls.model.objects.create(name=name, email=email,
                                                      active_directory=True)
        else:
            user = yield cls.model.objects.get(email=email, password=password)
            if not user:
                raise ReplyError(404, 'Invalid email or password')

        token = jwt.encode({
            'id': str(user.pk),
            'role': user.role,
        }, SECRET, algorithm='HS256')
        yield request.send({'token': token.decode('utf8'),
                            'userId': str(user.pk)})

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
