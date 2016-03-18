from __future__ import absolute_import

from motorengine import StringField, DateTimeField, ListField, ReferenceField
from raccoon.models import BaseModel, Method

class Flow(BaseModel):
    __collection__ = 'flows'

    name = StringField(required=True, unique=True)
    steps = ListField(StringField())
    method = ReferenceField(reference_document_type=Method)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

