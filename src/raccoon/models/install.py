from __future__ import absolute_import

from motorengine import Document, DateTimeField, ReferenceField
from raccoon.models import Build, Environment


class Install(Document):
    __collection__ = 'installs'

    build = ReferenceField(required=True, reference_document_type=Build)
    environment = ReferenceField(required=True, reference_document_type=Environment)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

