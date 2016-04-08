from __future__ import absolute_import

from motorengine import DateTimeField, ReferenceField
from raccoon.models import BaseModel, Build, Environment, Project


class Install(BaseModel):
    __collection__ = 'installs'

    build = ReferenceField(required=True, reference_document_type=Build)
    environment = ReferenceField(required=True, reference_document_type=Environment)
    project = ReferenceField(required=True, reference_document_type=Project)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

