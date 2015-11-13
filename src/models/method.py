from motorengine import Document, UUIDField, StringField, ListField, DateTimeField, ReferenceField
from raccoon.models import Connector


class Method(Document):
    __collection__ = 'methods'

    id = UUIDField()
    name = StringField()
    connector = ReferenceField(reference_document_type=Connector)
    method = StringField(required=True)
    arguments = ListField()
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


