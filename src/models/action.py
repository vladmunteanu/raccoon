from motorengine import Document, UUIDField, StringField, EmailField, ListField, DateTimeField, ReferenceField
from raccoon.models import Project, Environment, Method


class Action(Document):
    __collection__ = 'actions'

    id = UUIDField()
    name = StringField(required=True)
    label = StringField()
    project = ReferenceField(reference_document_type=Project)
    environment = ReferenceField(reference_document_type=Environment)
    method = ReferenceField(reference_document_type=Method)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)


