from __future__ import absolute_import

from motorengine import StringField, DateTimeField
from raccoon.models import BaseModel


class Project(BaseModel):
    __collection__ = 'projects'

    name = StringField(required=True, unique=True)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

