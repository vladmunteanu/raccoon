from __future__ import absolute_import

from motorengine import Document, UUIDField, StringField, ReferenceField, DateTimeField

from raccoon.models import Project
from raccoon.models import Environment
from raccoon.models import Method


class Action(Document):
    __collection__ = 'actions'

    id = StringField(unique=True)
    name = StringField(required=True)
    label = StringField()
    project = ReferenceField(reference_document_type=Project)
    environment = ReferenceField(reference_document_type=Environment)
    method = ReferenceField(reference_document_type=Method)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


