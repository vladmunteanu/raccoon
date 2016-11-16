import datetime

from mongoengine import StringField, ReferenceField, DateTimeField

from . import BaseModel, Project, Environment, Flow


class Action(BaseModel):

    name = StringField(required=True)
    label = StringField()
    project = ReferenceField(document_type=Project)
    environment = ReferenceField(document_type=Environment)
    flow = ReferenceField(document_type=Flow)
    placement = StringField()
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
