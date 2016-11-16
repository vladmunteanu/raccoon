import datetime

from mongoengine import StringField, DateTimeField

from . import BaseModel


class Environment(BaseModel):

    name = StringField(required=True, unique=True)
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
