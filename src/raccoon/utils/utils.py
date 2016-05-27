from datetime import datetime, timedelta
import time

from bson.objectid import ObjectId
from celery.states import ALL_STATES
from tornado import gen
from tornado.ioloop import IOLoop



def json_serial(obj):
    if isinstance(obj, datetime):
        return int(time.mktime(obj.timetuple()))

    if isinstance(obj, ObjectId):
        return str(obj)

    raise TypeError

@gen.coroutine
def sleep(milliseconds):
    yield gen.Task(
        IOLoop.instance().add_timeout,
        timedelta(milliseconds=milliseconds),
    )


RACCOON_STATES = {
    'ABORTED': 'REVOKED',
}

def to_celery_status(status):
    status = status.upper()
    if status in ALL_STATES:
        return status
    return RACCOON_STATES.get(status)
