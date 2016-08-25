from __future__ import absolute_import

from motorengine import StringField, ListField, DateTimeField, ReferenceField

from ..utils.dbfields import DictField
from . import Project, BaseModel


class Build(BaseModel):
    __collection__ = 'builds'

    project = ReferenceField(reference_document_type=Project)
    version = StringField(required=True)
    branch = StringField(required=True)
    changelog = ListField(DictField())
    labels = ListField(StringField())
    date_added = DateTimeField(required=True, auto_now_on_insert=True)
