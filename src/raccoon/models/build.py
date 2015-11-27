from __future__ import absolute_import

from motorengine import Document, StringField, ListField, DateTimeField, ReferenceField, JsonField
from raccoon.models import Project


class Build(Document):
    __collection__ = 'builds'

    project = ReferenceField(reference_document_type=Project)
    version = StringField(required=True)
    branch = StringField(required=True)
    changelog = ListField(JsonField())
    labels = ListField(StringField())
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


