import datetime

from mongoengine import StringField, DateTimeField, DictField

from . import BaseModel
from ..interfaces.base import REGISTERED


class Connector(BaseModel):

    name = StringField(required=True)
    type = StringField(required=True)
    config = DictField()
    date_added = DateTimeField(required=True, default=datetime.datetime.now)

    @property
    def interface(self):
        obj = REGISTERED[self.type]
        return obj(connector=self)
