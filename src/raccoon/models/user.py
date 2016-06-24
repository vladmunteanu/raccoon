from __future__ import absolute_import

from motorengine import StringField, EmailField, ListField, DateTimeField, ReferenceField
from raccoon.models import BaseModel, Right


class User(BaseModel):
    __collection__ = 'users'
    ignore = ['password']

    name = StringField()
    email = EmailField(required=True, unique=True)
    username = StringField()
    password = StringField(required=True)
    role = StringField(default='user')
    rights = ListField(ReferenceField(reference_document_type=Right))
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


