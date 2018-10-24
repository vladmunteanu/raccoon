import datetime

from mongoengine import StringField, DateTimeField

from raccoon.models import BaseModel


class Right(BaseModel):

    name = StringField(required=True, unique=True)
    date_added = DateTimeField(required=True, default=datetime.datetime.now)
