import datetime

from mongoengine import StringField, DateTimeField, ListField, ReferenceField

from raccoon.models import BaseModel, Project, Environment


class Right(BaseModel):

    name = StringField(required=True, unique=True)
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
    projects = ListField(StringField())
    environments = ListField(StringField())