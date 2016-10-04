from __future__ import absolute_import

import logging

from tornado import gen
from motorengine.errors import UniqueKeyViolationError, InvalidDocumentError
from bson.objectid import ObjectId

from ..utils.decorators import authenticated, is_admin
from ..utils.exceptions import ReplyError
from ..models import AuditLog

log = logging.getLogger(__name__)


class BaseController(object):
    """
    Base Controller
    """
    model = None

    # Override this to enable audit logs for PUT, POST and DELETE
    audit_logs = False

    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, pk=None, *args, **kwargs):
        if not cls.model:
            raise ReplyError(404)

        if pk:
            response = yield cls.model.objects.get(id=pk)
            if not response:
                raise ReplyError(404)

            response = response.get_dict()
        else:
            response = yield cls.model.objects.find_all()
            response = [r.get_dict() for r in response]

        yield request.send(response)

    @classmethod
    @authenticated
    @gen.coroutine
    def post(cls, request, *args, **kwargs):
        if not cls.model:
            raise ReplyError(404)

        params = {}
        for key, value in kwargs.items():
            if value and hasattr(cls.model, key):
                # !important
                # Make value = ObjectId(value) if field is a reference field
                field = cls.model.get_field_by_db_name(key)
                if hasattr(field, 'reference_type'):
                    value = ObjectId(value)

                params[key] = value

        try:
            response = yield cls.model.objects.create(**params)
        except UniqueKeyViolationError as e:
            raise ReplyError(409, cls.model.get_message_from_exception(e))
        except InvalidDocumentError as e:
            raise ReplyError(400, cls.model.get_message_from_exception(e))

        if cls.audit_logs:
            user = yield request.get_user()
            audit_log = AuditLog(user=user.email,
                                 action='new {}'.format(cls.model.__name__),
                                 message='{} {} added'.format(cls.model.__name__,
                                                              kwargs.get('name')))
            yield audit_log.save()

            request.broadcast(audit_log.get_dict(),
                              verb='post', resource='/api/v1/auditlogs/',
                              admin_only=True)

        request.broadcast(response.get_dict())

    @classmethod
    @is_admin
    @authenticated
    @gen.coroutine
    def put(cls, request, pk, *args, **kwargs):
        if not cls.model:
            raise ReplyError(404)

        if not pk:
            raise ReplyError(400)

        instance = yield cls.model.objects.get(id=pk)
        if not instance:
            raise ReplyError(404)

        yield instance.load_references()

        for key, value in kwargs.items():
            if hasattr(instance, key):
                # !important
                # Make value = ObjectId(value) if field is a reference field
                field = instance.get_field_by_db_name(key)
                if hasattr(field, 'reference_type'):
                    if not value:
                        value = None
                    value = ObjectId(value)

                setattr(instance, key, value)

        try:
            response = yield instance.save()
        except UniqueKeyViolationError as e:
            raise ReplyError(409, cls.model.get_message_from_exception(e))
        except InvalidDocumentError as e:
            raise ReplyError(400, cls.model.get_message_from_exception(e))

        if cls.audit_logs:
            user = yield request.get_user()
            audit_log = AuditLog(user=user.email,
                                 action='update {}'.format(cls.model.__name__),
                                 message='{} {} modified'.format(cls.model.__name__,
                                                                 kwargs.get('name')))
            yield audit_log.save()

            request.broadcast(audit_log.get_dict(),
                              verb='post', resource='/api/v1/auditlogs/',
                              admin_only=True)

        request.broadcast(response.get_dict())

    @classmethod
    @authenticated
    @gen.coroutine
    def patch(cls, *args, **kwargs):
        raise ReplyError(501)

    @classmethod
    @is_admin
    @authenticated
    @gen.coroutine
    def delete(cls, request, pk):
        if not cls.model:
            raise ReplyError(404)

        if not pk:
            raise ReplyError(400)

        instance = yield cls.model.objects.get(id=pk)

        if not instance:
            raise ReplyError(404)

        yield instance.load_references()

        try:
            yield instance.delete()
        except UniqueKeyViolationError as e:
            raise ReplyError(409, cls.model.get_message_from_exception(e))
        except InvalidDocumentError as e:
            raise ReplyError(400, cls.model.get_message_from_exception(e))

        if cls.audit_logs:
            user = yield request.get_user()
            audit_log = AuditLog(user=user.email,
                                 action='delete {}'.format(cls.model.__name__),
                                 message='{} {} deleted'.format(cls.model.__name__,
                                                                getattr(instance, 'name', '')))
            yield audit_log.save()

            request.broadcast(audit_log.get_dict(),
                              verb='post', resource='/api/v1/auditlogs/',
                              admin_only=True)

        request.broadcast(pk)
