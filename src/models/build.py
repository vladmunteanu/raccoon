from motorengine import Document, UUIDField, StringField, EmailField, ListField, DateTimeField, ReferenceField
from raccoon.models import Project


class Build(Document):
    __collection__ = 'builds'

    id = UUIDField()
    project = ReferenceField(reference_document_type=Project)
    version = StringField(required=True)
    date_added = ListField(DateTimeField(required=True, auto_now_on_insert=True))
    branch = StringField(required=True)
    changelog = ListField()
    labels = ListField()


