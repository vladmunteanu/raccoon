import datetime

from mongoengine import StringField, DateTimeField

from . import BaseModel


class AuditLog(BaseModel):

    message = StringField(required=True)
    user = StringField(required=True)
    action = StringField(required=True)
    environment = StringField()
    project = StringField()
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
