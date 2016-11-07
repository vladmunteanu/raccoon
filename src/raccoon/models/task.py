from __future__ import absolute_import

import logging

from celery.result import AsyncResult
from motorengine import StringField, ListField, DateTimeField, ReferenceField

from . import BaseModel, Job, User, Environment
from ..utils.dbfields import DictField


log = logging.getLogger(__name__)


class Task(BaseModel):
    __collection__ = 'tasks'

    tasks = ListField(StringField())
    user = ReferenceField(reference_document_type=User, required=True)
    connector_type = StringField(required=True)
    job = ReferenceField(reference_document_type=Job)
    environment = ReferenceField(reference_document_type=Environment)
    context = DictField()
    callback_details = DictField(default={})
    date_added = DateTimeField(auto_now_on_insert=True)

    result = DictField(default={})
    console_output = StringField()

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

    @property
    def callback(self):
        """
        :return: deserialized function
        """
        module_name = self.callback_details.get('module_name')
        class_name = self.callback_details.get('class_name')
        method_name = self.callback_details.get('method_name')

        func = None
        if module_name and class_name and method_name:
            i = __import__(module_name, fromlist=[class_name])
            class_ = getattr(i, class_name)
            func = getattr(class_, method_name, None)

        return func

    def add_callback(self, func):
        """
        :param func: function
        :return: None
        """
        if not func:
            return

        class_name = func.__qualname__.split('.')[0]
        self.callback_details = {
            'module_name': func.__module__,
            'class_name': class_name,
            'method_name': func.__name__,
        }
