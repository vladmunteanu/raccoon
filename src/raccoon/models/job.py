import datetime

from mongoengine import StringField, ListField, DateTimeField
from mongoengine import ReferenceField, DictField

from raccoon.models import BaseModel, Connector


class Job(BaseModel):

    name = StringField(required=True)
    connector = ReferenceField(document_type=Connector)
    action_type = StringField(required=True)
    job = StringField(required=True)
    arguments = ListField(DictField())
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
