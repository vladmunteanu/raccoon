import datetime

from mongoengine import StringField, DateTimeField, IntField

from raccoon.models import BaseModel


class Environment(BaseModel):

    name = StringField(required=True, unique=True)
    date_added = DateTimeField(required=True, default=datetime.datetime.now)

    # environment position, for reordering
    position = IntField(default=0)
