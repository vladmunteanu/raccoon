from __future__ import absolute_import

from motorengine import StringField, DateTimeField

from . import BaseModel
from ..utils.dbfields import DictField
from ..interfaces.base import REGISTERED


class Connector(BaseModel):
    __collection__ = 'connectors'

    name = StringField(required=True)
    type = StringField(required=True)
    config = DictField()
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

    @property
    def interface(self):
        obj = REGISTERED[self.type]
        return obj(connector=self)
