from __future__ import absolute_import

import logging
from celery.states import EXCEPTION_STATES

from tornado import gen

from ..models import Task
from .base import BaseController
from ..utils.exceptions import ReplyError


log = logging.getLogger(__name__)


class TasksController(BaseController):
    """
    Tasks Controller
    """
    model = Task

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
        task = yield Task.objects.get(id=pk)
        if not task:
            log.error('Task %s does not exist, but status was reported', pk)
            raise ReplyError(404)

        task.result = kwargs.get('result')
        task.console_output = kwargs.get('console_output')
        yield task.save()

        # call callback for this task
        callback_method = task.callback
        if not callback_method:
            yield request.send()
            return

        if task.status in EXCEPTION_STATES:
            log.info('Task %s finished with status %s',
                     task.pk, task.status)
            return

        yield callback_method(task=task, response=kwargs.get('result'))

        # send the updated Task object
        request.broadcast(task.get_dict(), verb='PUT',
                          resource='/api/v1/tasks/{}'.format(pk))
