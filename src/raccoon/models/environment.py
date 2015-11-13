from __future__ import absolute_import

from motorengine import Document, UUIDField, StringField, DateTimeField


class Environment(Document):
    __collection__ = 'environments'

    id = UUIDField()
    name = StringField(required=True, unique=True)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

