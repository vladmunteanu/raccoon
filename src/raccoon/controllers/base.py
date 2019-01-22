import logging

from tornado import gen
from bson import ObjectId, DBRef
from mongoengine import ReferenceField
from mongoengine.errors import NotUniqueError, InvalidDocumentError
from mongoengine.errors import DoesNotExist

from raccoon.utils.decorators import authenticated, is_admin
from raccoon.utils.exceptions import ReplyError
from raccoon.models import AuditLog, Right

log = logging.getLogger(__name__)


class BaseController(object):
    """ Base Controller """
    model = None
    page_size = 30

    # Override this to enable audit logs for PUT, POST and DELETE
    audit_logs = False

    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, pk=None, *args, **kwargs):
        """
        Fetches all instances of that class, or a specific instance
        if pk is given.

        :param request: client request
        :type request: raccoon.utils.request.Request
        :param pk: primary key of an instance
        :param args: not used
        :param kwargs: not used
        :return: None
        """
        if not cls.model:
            raise ReplyError(404)

        if pk:
            try:
                response = cls.model.objects.get(id=pk)
            except DoesNotExist:
                raise ReplyError(404)

            response = response.get_dict()
        else:
            response = cls.model.objects.all()
            response = [r.get_dict() for r in response]

        # get the rights of the user
        rights = []
        for right_id in request.user.rights:
            try:
                rights.append(Right.objects.get(pk=right_id))
            except:
                pass

        request.send(cls.filter_response(response, rights))

    @classmethod
    def check_rights(cls, entity, rights):
        return entity

    @classmethod
    def filter_response(cls, response, rights):
        """
        Filters the response based on the assigned rights of the user
        
        :param response:
        :param rights:
        :return:
        """
        if not rights:
            return response

        # treat rights if there is only one entity in the response
        if type(response) is dict:
            if cls.check_rights(response, rights):
                return response
            else:
                raise ReplyError(404)

        result = list()
        # filter entities that should be returned
        for entity in response:
            if cls.check_rights(entity, rights):
                result.append(entity)

        return result


    @classmethod
    @authenticated
    @gen.coroutine
    def post(cls, request, *args, **kwargs):
        """
        Creates a new instance of the class, based on the body
        received from the client.

        If audit_logs is enabled on the class, then a log item will be created
        for this action.

        Broadcasts the action to all connected users.

        :param request: client request
        :type request: raccoon.utils.request.Request
        :param args: not used
        :param kwargs: instance body
        :return: None
        """
        if not cls.model:
            raise ReplyError(404)

        params = {}
        for key, value in kwargs.items():
            if value and hasattr(cls.model, key):
                # !important
                # Make value = ObjectId(value) if field is a reference field
                field = cls.model._fields.get(key)
                if type(field) is ReferenceField:
                    if not value:
                        value = None
                    else:
                        model_name = field.document_type._get_collection().name
                        value = DBRef(model_name, ObjectId(value))

                params[key] = value

        try:
            response = cls.model.objects.create(**params)
        except NotUniqueError as e:
            log.info(
                "Failed to create {}".format(cls.model.__name__),
                exc_info=True
            )
            raise ReplyError(409, cls.model.get_message_from_exception(e))
        except InvalidDocumentError as e:
            log.info(
                "Invalid document {}".format(cls.model.__name__),
                exc_info=True
            )
            raise ReplyError(400, cls.model.get_message_from_exception(e))

        if cls.audit_logs:
            user = request.user
            audit_log = AuditLog(
                user=user.email,
                action='new {}'.format(cls.model.__name__),
                message='{} {} added'.format(
                    cls.model.__name__, kwargs.get('name')
                )
            )
            audit_log.save()

            request.broadcast(
                audit_log.get_dict(),
                verb='post', resource='/api/v1/auditlogs/',
                admin_only=True
            )

        request.broadcast(response.get_dict())

    @classmethod
    @is_admin
    @authenticated
    @gen.coroutine
    def put(cls, request, pk, *args, **kwargs):
        """
        Updates an instance of the class, identified by its primary key.

        If audit_logs is enabled on the class, then a log item will be created
        for this action.

        Broadcasts the action to all connected users.

        :param request: client request
        :type request: raccoon.utils.request.Request
        :param pk: primary key
        :param args: not used
        :param kwargs: instance body
        :return: None
        """
        if not cls.model:
            raise ReplyError(404)

        if not pk:
            raise ReplyError(400)

        try:
            instance = cls.model.objects.get(id=pk)
        except DoesNotExist:
            raise ReplyError(404)

        for key, value in kwargs.items():
            if hasattr(instance, key):
                # Make value = DBRef(model, ObjectId(value))
                # if field is a reference field
                field = instance._fields.get(key)
                if type(field) is ReferenceField:
                    if not value:
                        value = None
                    else:
                        model_name = field.document_type._get_collection().name
                        value = DBRef(model_name, ObjectId(value))

                setattr(instance, key, value)

        try:
            response = instance.save()
        except NotUniqueError as e:
            log.info("Duplicate key", exc_info=True)
            raise ReplyError(409, cls.model.get_message_from_exception(e))
        except InvalidDocumentError as e:
            log.info("Invalid document error:", exc_info=True)
            raise ReplyError(400, cls.model.get_message_from_exception(e))

        if cls.audit_logs:
            user = request.user
            audit_log = AuditLog(
                user=user.email,
                action='update {}'.format(cls.model.__name__),
                message='{} {} modified'.format(
                    cls.model.__name__,
                    kwargs.get('name', getattr(instance, 'name', None))
                )
            )
            audit_log.save()

            request.broadcast(
                audit_log.get_dict(),
                verb='post', resource='/api/v1/auditlogs/',
                admin_only=True
            )

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
        """
        Deletes an instance of the class, identified by its primary key.

        If audit_logs is enabled on the class, then a log item will be created
        for this action.

        Broadcasts the action to all connected users.

        :param request: client request
        :type request: raccoon.utils.request.Request
        :param pk: primary key
        :return: None
        """
        if not cls.model:
            raise ReplyError(404)

        if not pk:
            raise ReplyError(400)

        try:
            instance = cls.model.objects.get(id=pk)
        except DoesNotExist:
            raise ReplyError(404)

        try:
            instance.delete()
        except NotUniqueError as e:
            log.info("Not unique error", exc_info=True)
            raise ReplyError(409, cls.model.get_message_from_exception(e))
        except InvalidDocumentError as e:
            log.info("Invalid document error", exc_info=True)
            raise ReplyError(400, cls.model.get_message_from_exception(e))

        if cls.audit_logs:
            user = request.user
            audit_log = AuditLog(
                user=user.email,
                action='delete {}'.format(cls.model.__name__),
                message='{} {} deleted'.format(
                    cls.model.__name__, getattr(instance, 'name', '')
                )
            )
            audit_log.save()

            request.broadcast(
                audit_log.get_dict(),
                verb='post', resource='/api/v1/auditlogs/',
                admin_only=True
            )

        request.broadcast(pk)
