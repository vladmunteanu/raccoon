from __future__ import absolute_import

from motorengine import Document, UUIDField, StringField, ListField, DateTimeField, ReferenceField, JsonField
from raccoon.models import Connector


class Method(Document):
    __collection__ = 'methods'

    id = UUIDField()
    name = StringField(required=True)
    connector = ReferenceField(reference_document_type=Connector)
    method = StringField(required=True)
    arguments = ListField(JsonField())
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


