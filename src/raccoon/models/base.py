from copy import deepcopy

from motorengine import Document
from motorengine.errors import UniqueKeyViolationError, InvalidDocumentError


class BaseModel(Document):
    ignore = []

    @property
    def pk(self):
        return self._id

    def get_dict(self):
        result = deepcopy(super(Document, self).to_son())
        result['id'] = self._id
        for key in self.ignore:
            result.pop(key, None)
        return result

    @classmethod
    def get_field_names(cls, unique=False):
        if unique:
            return [k for (k, v) in cls._fields.items() if v.unique]
        return cls._fields.keys()

    @classmethod
    def get_message_from_exception(cls, e):
        message = 'Unknown error on saving instance!!!'
        fields = cls.get_field_names()

        if isinstance(e, UniqueKeyViolationError):
            message = 'A {class_name} with the same {field} exists!'
            fields = cls.get_field_names(unique=True)

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
