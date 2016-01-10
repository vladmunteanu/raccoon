from __future__ import absolute_import

from motorengine import StringField, DateTimeField, BaseField
from raccoon.models import BaseModel

class DictField(BaseField):
    """
    Field responsible for storing dict objects.
    """

    def validate(self, value):
        return isinstance(value, dict)

    def to_son(self, value):
        return value

    def from_son(self, value):
        return value


class Project(BaseModel):
    __collection__ = 'projects'

    name = StringField(required=True, unique=True)
    details = DictField(default={})
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

