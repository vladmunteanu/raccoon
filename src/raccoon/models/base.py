import logging

from mongoengine import Document
from mongoengine.errors import InvalidDocumentError, NotUniqueError

log = logging.getLogger(__name__)


class BaseModel(Document):
    meta = {
        'abstract': True,
    }

    # Add fields to ignore in the dict representation
    ignore = ['_id']

    def get_dict(self):
        """
            Returns a dict representation of the object, adding the primary key.

        :return: dict representation
        :rtype: dict
        """
        result = self.to_mongo().to_dict()
        result['id'] = str(self.pk)
        for ignored_field in self.ignore:
            result.pop(ignored_field, None)
        return result

    @classmethod
    def get_message_from_exception(cls, e):
        """
            Parses the exception and returns an error message for this model.

        :param e: exception
        :type e: Exception
        :return: string message
        :rtype: str
        """
        message = 'Unknown error on saving instance!!!'
        fields = cls._fields

        if isinstance(e, NotUniqueError):
            message = 'A {class_name} with the same {field} exists!'

        if isinstance(e, InvalidDocumentError):
            message = 'Invalid {field} for {class_name}!'

        for field in fields:
            if field in str(e):
                message = message.format(
                    class_name=cls.__name__.lower(),
                    field=field
                )
                break

        return message

    def __str__(self):
        return str(self.get_dict())

    def __repr__(self):
        return str(self.get_dict())
