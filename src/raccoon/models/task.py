import logging
import datetime

from mongoengine import StringField, DateTimeField, ReferenceField, DictField

from raccoon.models import BaseModel, User, Job, Environment


log = logging.getLogger(__name__)


class Task(BaseModel):

    user = ReferenceField(document_type=User, required=True)
    connector_type = StringField(required=True)
    job = ReferenceField(document_type=Job)
    environment = ReferenceField(document_type=Environment)
    context = DictField()
    callback_details = DictField(default={})
    date_added = DateTimeField(default=datetime.datetime.now)

    status = StringField()
    result = DictField(default={})
    console_output = StringField()

    @property
    def callback(self):
        """
            Imports the callback function based on callback_details.

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
            Adds a callback by setting callback_details, allowing the task
        to be serialized.

        :param func: callback function
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
