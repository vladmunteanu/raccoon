from __future__ import absolute_import

from celery.result import AsyncResult
from motorengine import StringField, ListField, DateTimeField

from raccoon.models import BaseModel


class Task(BaseModel):
    __collection__ = 'tasks'

    tasks = ListField(StringField())
    date_added = DateTimeField(auto_now_on_insert=True)

    @property
    def status(self):
        for item in self.tasks:
            task = AsyncResult(item)
            if task.status != 'SUCCESS':
                return task.status

        return 'SUCCESS'
