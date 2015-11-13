from motorengine import Document, UUIDField, StringField, EmailField, ListField, DateTimeField, ReferenceField
from raccoon.models import Right


class User(Document):
    __collection__ = 'users'

    id = UUIDField()
    name = StringField()
    email = EmailField(required=True, unique=True)
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    rights = ListField(ReferenceField(reference_document_type=Right))
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


