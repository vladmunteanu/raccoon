from __future__ import absolute_import

from motorengine import StringField, ListField, DateTimeField, ReferenceField
from raccoon.models import BaseModel, Connector
from raccoon.utils.dbfields import DictField


class Method(BaseModel):
    __collection__ = 'methods'

    name = StringField(required=True)
    connector = ReferenceField(reference_document_type=Connector)
    method = StringField(required=True)
    arguments = ListField(DictField())
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


