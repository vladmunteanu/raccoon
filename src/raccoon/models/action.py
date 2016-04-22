from __future__ import absolute_import

from motorengine import StringField, ListField, ReferenceField, DateTimeField

from raccoon.models import Project
from raccoon.models import Environment
from raccoon.models import Job
from raccoon.models import Flow
from raccoon.models import BaseModel


class Action(BaseModel):
    __collection__ = 'actions'

    name = StringField(required=True)
    label = StringField()
    project = ReferenceField(reference_document_type=Project)
    environment = ReferenceField(reference_document_type=Environment)
    job = ReferenceField(reference_document_type=Job)
    flow  =  ReferenceField(reference_document_type=Flow)
    placement = StringField()
    date_added = DateTimeField(required=True, auto_now_on_insert=True)
