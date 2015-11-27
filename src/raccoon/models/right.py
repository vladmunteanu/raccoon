from __future__ import absolute_import

from motorengine import Document, StringField, DateTimeField


class Right(Document):
    __collection__ = 'rights'

    name = StringField(required=True, unique=True)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


