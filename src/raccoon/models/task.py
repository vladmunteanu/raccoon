from __future__ import absolute_import

from celery.result import AsyncResult
from motorengine import StringField, ListField, DateTimeField, ReferenceField

from raccoon.models import BaseModel, Job, User, Project, Environment
from raccoon.utils.dbfields import DictField


class Task(BaseModel):
    __collection__ = 'tasks'

    tasks = ListField(StringField())
    user = ReferenceField(reference_document_type=User)
    job = ReferenceField(reference_document_type=Job)
    project = ReferenceField(reference_document_type=Project)
    environment = ReferenceField(reference_document_type=Environment)
    context = DictField()
    date_added = DateTimeField(auto_now_on_insert=True)

    @property
    def status(self):
        for item in self.tasks:
            task = AsyncResult(item)
            if task.status != 'SUCCESS':
                return task.status

        return 'SUCCESS'

    def get_dict(self):
        result = super().get_dict()
        result['status'] = self.status
        return result
