from __future__ import absolute_import

import json
import requests
from urllib.parse import urlparse, urljoin

from celery import Celery, Task
from celery.utils.log import get_task_logger
from websocket import create_connection

from settings import DB
from raccoon.utils.utils import json_serial


log = get_task_logger(__name__)
connection_string = '{scheme}://{host}:{port}/{db_name}'.format(
    scheme=DB['scheme'],
    host=DB['host'],
    port=DB['port'],
    db_name=DB['name'],
)
celery = Celery('tasks', broker=connection_string, backend=connection_string)
ws = None

def broadcast(data):
    global ws

    try:
        if not ws:
            ws = create_connection('ws://localhost:8888/websocket')
        else:
            try:
                ws.ping()
                ws.ping()
            except BrokenPipeError:
                ws = create_connection('ws://localhost:8888/websocket')
    except ConnectionRefusedError:
        log.error('Connection to raccoon server refused!', exc_info=True)

    ws.send(json.dumps({
        'verb': 'post',
        'resource': '/api/v1/notifications/broadcast',
        'body': data,
    }, default=json_serial))

def fetch(url, method='GET', body=None, headers=None):
    r = requests.get(url, verify=False)
    body = r.json()
    headers = r.headers
    return (body, headers)


class JenkinsJobWatcherTask(Task):
    def __init__(self):
        self.max_retries = None

    def run(self, url, id, api_url, *args, **kwargs):
        parsed_url = urlparse(url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        url = urljoin(api_url, path)

        response, headers = fetch(
            method='GET',
            url=url,
        )

        status = response.get('result') or 'STARTED'
        broadcast({
            'verb': 'patch',
            'resource': '/api/v1/tasks/{}'.format(id),
            'data': {
                'id': id,
                'status': status,
                'started_at': response.get('timestamp'),
                'estimated_duration': response.get('estimatedDuration'),
                'response': response,
            }
        })

        # change status from ABORTED to REVOKED
        status = 'REVOKED' if status == 'ABORTED' else status

        if status in ('SUCCESS', 'REVOKED', 'FAILURE'):
            return status

        raise self.retry(countdown=5, max_retries=None)

    def on_retry(self, exc, task_id, args, kwargs, einfo):
        self.update_state(task_id=task_id, state='PENDING')

    def on_success(self, status, task_id, *args, **kwargs):
        self.update_state(task_id=task_id, state=status)
        print (['done: @@@@@@@', status, task_id, args, kwargs])


class JenkinsQueueWatcherTask(Task):
    def __init__(self):
        self.max_retries = None

    def run(self, url, id, api_url, *args, **kwargs):
        parsed_url = urlparse(url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        url = urljoin(api_url, path)

        response, headers = fetch(
            method='GET',
            url=url,
        )

        broadcast({
            'verb': 'patch',
            'resource': '/api/v1/tasks/{}'.format(id),
            'data': {
                'id': id,
                'status': 'PENDING',
                'why': response.get('why'),
                'response': response,
            }
        })

        build_url = response.get('executable', {}).get('url')
        if build_url:
            return build_url

        raise self.retry(countdown=5, max_retries=None)

    def on_retry(self, exc, task_id, args, kwargs, einfo):
        self.update_state(task_id=task_id, state='PENDING')

    def on_success(self, build_url, task_id, *args, **kwargs):
        print (['done: @@@@@@@', build_url, task_id, args, kwargs])


jenkins_queue_watcher = celery.tasks[JenkinsQueueWatcherTask.name]
jenkins_job_watcher = celery.tasks[JenkinsJobWatcherTask.name]


if __name__ == '__main__':
    celery.start()
