from __future__ import absolute_import

from motorengine import StringField, ReferenceField, DateTimeField

from . import Project, Environment, Flow, BaseModel


class Action(BaseModel):
    __collection__ = 'actions'

    name = StringField(required=True)
    label = StringField()
    project = ReferenceField(reference_document_type=Project)
    environment = ReferenceField(reference_document_type=Environment)
    flow = ReferenceField(reference_document_type=Flow)
    placement = StringField()
    date_added = DateTimeField(required=True, auto_now_on_insert=True)
