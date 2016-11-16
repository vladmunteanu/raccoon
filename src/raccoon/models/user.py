import datetime

from mongoengine import StringField, EmailField, BooleanField, ListField
from mongoengine import DateTimeField, ReferenceField

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
    rights = ListField(ReferenceField(document_type=Right))
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
