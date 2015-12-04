from __future__ import absolute_import

from motorengine import StringField, DateTimeField, JsonField
from raccoon.models import BaseModel


class Connector(BaseModel):
    __collection__ = 'connectors'

    name = StringField(required=True)
    config = JsonField()
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

