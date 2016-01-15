from __future__ import absolute_import

from motorengine import StringField, DateTimeField
from raccoon.models import BaseModel
from raccoon.utils.dbfields import DictField


class Connector(BaseModel):
    __collection__ = 'connectors'

    name = StringField(required=True)
    config = DictField()
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

