import logging

from tornado import gen
from mongoengine.errors import DoesNotExist

from . import BaseController
from ..models import Task
from ..utils.exceptions import ReplyError
from ..tasks.long_polling import FAILURE


log = logging.getLogger(__name__)

PAGE_SIZE = 50


class TasksController(BaseController):
    """ Tasks Controller """
    model = Task


    @classmethod
    @gen.coroutine
    def get(cls, request, pk=None, *args, **kwargs):
        if pk:
            try:
                response = Task.objects.get(id=pk)
            except DoesNotExist:
                raise ReplyError(404)

            response = response.get_dict()
        else:
            response = Task.objects.order_by('-date_added')[:PAGE_SIZE]
            response = [r.get_dict() for r in response]

        request.send(response)

    @classmethod
    @gen.coroutine
    def put(cls, request, pk, *args, **kwargs):
        """
            Updates a Task and executes the callback method.

        :param request: the client request
        :param pk: primary key
        :param args: not used
        :param kwargs: Body of the HTTP request
        :return: None
        """
        try:
            task = Task.objects.get(id=pk)
        except DoesNotExist:
            log.error('Task %s does not exist, but status was reported', pk)
            raise ReplyError(404)

        task.result = kwargs.get('result')
        task.console_output = kwargs.get('console_output')
        task.save()

        # call callback for this task
        callback_method = task.callback
        if not callback_method:
            request.send()
            return

        if task.status == FAILURE:
            log.info('Task %s finished with status %s',
                     task.pk, task.status)
            return

        yield callback_method(task=task, response=kwargs.get('result'))

        # send the updated Task object
        request.broadcast(task.get_dict(), verb='PUT',
                          resource='/api/v1/tasks/{}'.format(pk))
