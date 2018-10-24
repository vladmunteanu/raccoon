import datetime

from mongoengine import DateTimeField, ReferenceField

from raccoon.models import BaseModel, Build, Environment, Project, Task


class Install(BaseModel):

    build = ReferenceField(required=True, document_type=Build)
    environment = ReferenceField(required=True, document_type=Environment)
    project = ReferenceField(required=True, document_type=Project)
    task = ReferenceField(document_type=Task)
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
