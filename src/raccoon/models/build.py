import datetime

from mongoengine import StringField, ListField
from mongoengine import DateTimeField, ReferenceField, DictField

from . import BaseModel, Project, Task


class Build(BaseModel):

    project = ReferenceField(document_type=Project)
    task = ReferenceField(document_type=Task)
    version = StringField(required=True)
    branch = StringField(required=True)
    changelog = ListField(DictField())
    labels = ListField(StringField())
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
