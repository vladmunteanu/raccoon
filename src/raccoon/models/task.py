from __future__ import absolute_import

from celery.result import AsyncResult
from motorengine import StringField, ListField, DateTimeField, ReferenceField

from raccoon.models import BaseModel, Job, User


class Task(BaseModel):
    __collection__ = 'tasks'

    tasks = ListField(StringField())
    user = ReferenceField(reference_document_type=User)
    job = ReferenceField(reference_document_type=Job)
    date_added = DateTimeField(auto_now_on_insert=True)

    @property
    def status(self):
        for item in self.tasks:
            task = AsyncResult(item)
            if task.status != 'SUCCESS':
                return task.status

        return 'SUCCESS'
