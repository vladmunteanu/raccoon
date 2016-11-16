import datetime

from mongoengine import StringField, DateTimeField, ListField, ReferenceField

from . import BaseModel, Job


class Flow(BaseModel):

    name = StringField(required=True, unique=True)
    steps = ListField(StringField())
    job = ReferenceField(document_type=Job)
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
