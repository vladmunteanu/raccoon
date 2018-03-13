import logging

import jwt
import bcrypt
from tornado import gen
from ldap3 import Server, Connection, ALL, AUTH_SIMPLE
from ldap3.core.exceptions import LDAPBindError
from mongoengine.errors import DoesNotExist

from raccoon.controllers import BaseController
from raccoon.settings import SECRET, LDAP_AUTH, LDAP_CONF
from raccoon.models import User
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class AuthController(BaseController):
    model = User

    @classmethod
    @gen.coroutine
    def get(cls, request, pk=None, *args, **kwargs):
        raise ReplyError(501)

    @classmethod
    @gen.coroutine
    def post(cls, request, email=None, password=None, **kwargs):
        """
        Authenticates a user given email and password.

        If LDAP_AUTH is enabled in Raccoon settings, then the LDAP server
        will be queried to check the user credentials.
        Else, the user credentials are checked against the database and the
        password encrypted with bcrypt.

        :param request: client request
        :param email: user credential email
        :param password: user credential password
        :param kwargs: not used
        :return: None
        """
        if not email or not password:
            raise ReplyError(400, 'Invalid email or password')

        if LDAP_AUTH:
            try:
                server = Server(LDAP_CONF['uri'], port=LDAP_CONF['port'],
                                get_info=ALL)
                with Connection(
                    server, authentication=AUTH_SIMPLE, user=email,
                    password=password, auto_bind=True
                ) as conn:
                    conn.search(
                        search_base='DC=ad,DC=avira,DC=com',
                        search_filter='(userPrincipalName=%s)' % email,
                        attributes=['displayName']
                    )
                    name = str(conn.entries[0].displayName)
            except LDAPBindError:
                raise ReplyError(404, 'LDAP invalid credentials')
            except:
                raise ReplyError(500, 'LDAP server error')

            try:
                user = cls.model.objects.get(email=email)
            except DoesNotExist:
                user = cls.model.objects.create(
                    name=name, email=email, active_directory=True
                )
        else:
            password = password.encode('utf-8')
            try:
                user = cls.model.objects.get(email=email)
            except DoesNotExist:
                raise ReplyError(404, 'Invalid email or password!')

            if not bcrypt.checkpw(password, user.password.encode('utf-8')):
                raise ReplyError(404, 'Invalid email or password')

        token = jwt.encode(
            {'id': str(user.pk), 'role': user.role},
            SECRET, algorithm='HS256'
        )
        request.send({'token': token.decode('utf8'), 'userId': str(user.pk)})

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
