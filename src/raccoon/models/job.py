from __future__ import absolute_import

from motorengine import StringField, ListField, DateTimeField, ReferenceField
from raccoon.models import BaseModel, Connector
from raccoon.utils.dbfields import DictField


class Job(BaseModel):
    __collection__ = 'jobs'

    name = StringField(required=True)
    connector = ReferenceField(reference_document_type=Connector)
    job = StringField(required=True)
    arguments = ListField(DictField())
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


