from __future__ import absolute_import

from motorengine import StringField, EmailField, BooleanField
from motorengine import ListField, DateTimeField, ReferenceField

from . import BaseModel, Right
from ..settings import LDAP_AUTH


class User(BaseModel):
    __collection__ = 'users'
    ignore = ['password']

    name = StringField()
    email = EmailField(required=True, unique=True)
    password = StringField()
    active_directory = BooleanField(required=True, default=LDAP_AUTH)
    role = StringField(default='user')
    rights = ListField(ReferenceField(reference_document_type=Right))
    date_added = DateTimeField(required=True, auto_now_on_insert=True)
