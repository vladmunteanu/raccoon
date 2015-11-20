from __future__ import absolute_import

from motorengine import Document, UUIDField, StringField, DateTimeField


class Project(Document):
    __collection__ = 'projects'

    id = StringField(unique=True)
    name = StringField(required=True, unique=True)
    date_added = StringField(required=True)#, auto_now_on_insert=True) #DateTimeField

