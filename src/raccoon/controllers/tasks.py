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
        task = yield Task.objects.get(id=pk)
        if not task:
            log.error('Task %s does not exist, but status was reported', pk)
            raise ReplyError(404)

        # call callback for this task
        callback_method = task.callback
        if not callback_method:
            yield request.send()
            return

        if task.status in EXCEPTION_STATES:
            log.info('Task %s finished with status %s', task._id, task.status)
            return

        yield callback_method(request=request, task=task, response=kwargs)
        yield request.send()
