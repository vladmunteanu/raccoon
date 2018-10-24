import logging
import datetime

from tornado.ioloop import IOLoop
from tornado import gen

from raccoon.utils.exceptions import RetryException, MaxRetriesExceeded, TaskAborted
from raccoon.utils.request import broadcast

log = logging.getLogger(__name__)

PENDING = 'PENDING'
STARTED = 'STARTED'
SUCCESS = 'SUCCESS'
FAILURE = 'FAILURE'
ABORTED = 'ABORTED'

READY_STATES = (SUCCESS, FAILURE, ABORTED)
UNREADY_STATES = (PENDING, STARTED)

DEFAULT_COUNTDOWN = 5  # seconds to wait before retry


class BaseLongPollingTask(object):

    def __init__(self, task, countdown=None, max_retries=None, *args, **kwargs):
        """
        Represents the base class for long polling tasks using tornado's
        add_timeout function.

        :param task: Task model instance, which will be updated in the process
        :type task: Task
        :param countdown: Timeout to use between retries (seconds)
        :type countdown: int
        :param max_retries: Maximum retries allowed. None is infinity.
        :type max_retries: int
        :param args: Arguments which will be saved in self.args
        :param kwargs: Keyword arguments which will be saved in self.kwargs
        """
        # set the countdown, time between retries
        self.countdown = countdown or DEFAULT_COUNTDOWN

        # and the maximum retries allowed
        self.retry_counter = 0
        self.max_retries = max_retries

        # Task model instance
        self.task = task
        self.task.status = PENDING

        self.args = args
        self.kwargs = kwargs

    def notify_clients(self, extra=None):
        """
        Notifies clients about task changes, such as status updates.

        :param extra: Extra data which will update the Task get_dict result.
        :type extra: dict
        :return: None
        """
        task_dict = self.task.get_dict()

        # update the task dictionary with extra information
        if extra:
            task_dict.update(extra)

        broadcast(
            verb='patch',
            resource="/api/v1/tasks/{}".format(self.task.pk),
            response=task_dict
        )

    @gen.coroutine
    def run(self):
        """
        Performs the actual work. Overwrite this to implement a task.
        When your task runs successfully, on_success is called with the return
        value as parameter.

        If RetryException is raised, the task will be rescheduled.
        Any other Exception represents a FAILURE.

        :return: None
        """
        pass

    @gen.coroutine
    def on_success(self, result):
        """
        Called to handle post-run actions, such as cleanup
        or updating objects.
        By default, it updates the task status to SUCCESS and notifies clients.

        :return: None
        """

        self.task.status = SUCCESS
        self.task.save()
        self.notify_clients()

    def _retry(self, countdown=None):
        """
        Re-schedules the task after countdown seconds.
        Checks the current retry counter against max_retries.

        :param countdown: Overwrites self.countdown (seconds)
        :type countdown: int
        :return: None
        """
        if self.max_retries and self.retry_counter >= self.max_retries:
            raise MaxRetriesExceeded

        IOLoop.current().add_timeout(
            datetime.timedelta(seconds=countdown or self.countdown),
            self._run
        )

        self.retry_counter += 1

    @gen.coroutine
    def _run(self):
        """
        Wrapper for the run function.
        Handles RetryException to re-schedule the task.

        :return: None
        """
        try:
            try:
                retval = yield self.run()
                yield self.on_success(retval)
            except RetryException as exc:
                self._retry(exc.countdown)
            except TaskAborted:
                log.warning("Task aborted!")
                self.task.status = ABORTED
                self.task.save()
                self.notify_clients()
        except:
            log.error("Task failed!", exc_info=True)
            self.task.status = FAILURE
            self.task.save()
            self.notify_clients()

    @gen.coroutine
    def delay(self, countdown=0):
        """
        Start the execution in countdown seconds.

        :param countdown: Timeout before first run. (seconds, default 0)
        :type countdown: int
        :return: None
        """
        try:
            IOLoop.current().add_timeout(
                datetime.timedelta(seconds=countdown),
                self._run
            )
        except:
            self.task.status = FAILURE
            self.task.save()
            self.notify_clients()

            log.error("Couldn't schedule task", exc_info=True)
            raise
