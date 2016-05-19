import random
import json
from websocket import create_connection

from celery import Celery, Task

from settings import DB
from raccoon.utils.utils import json_serial


connection_string = '{scheme}://{host}:{port}/{db_name}'.format(
    scheme=DB['scheme'],
    host=DB['host'],
    port=DB['port'],
    db_name=DB['name'],
)
celery = Celery('tasks', broker=connection_string, backend=connection_string)
ws = create_connection('ws://localhost:8888/websocket')

class _WatchTask(Task):
    def __init__(self):
        self.max_retries = None

    def run(self, target, *args, **kwargs):
        r = random.randint(0, 10)

        print (['aaaaaaaaaaaaaaaaa', 'target is', target, 'i generated', r, args, kwargs])

        ws.send(json.dumps({
            'verb': 'post', 
            'resource': '/api/v1/notifications/broadcast',
            'body': {
                'verb': 'put',
                'resource': '/api/v1/tasks/12345',
                'data': {
                    'progress': r
                }
            }
        }, default=json_serial))
        print (['bbbbbbbbbbbbbbbb', 'target is', target, 'i generated', r, args, kwargs])
        if r == target:
            return 'Found target'

        raise self.retry(countdown=5, max_retries=None)

    def on_success(self, retval, task_id, *args, **kwargs):
        print (['done: @@@@@@@', retval, task_id, args, kwargs])


watch = celery.tasks[_WatchTask.name]

if __name__ == '__main__':
    celery.start()
