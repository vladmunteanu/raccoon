from __future__ import absolute_import

from motorengine import Document, UUIDField, StringField, DateTimeField, ReferenceField
from raccoon.models import Build


class Install(Document):
    __collection__ = 'installs'

    id = UUIDField()
    build = ReferenceField(reference_document_type=Build)
    environment = StringField(required=True)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

