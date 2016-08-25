from __future__ import absolute_import

import json
import requests
import traceback
import sys
from urllib.parse import urlparse, urljoin

from celery import Celery, Task, states
from celery.utils.log import get_task_logger
from websocket import create_connection

from settings import DB
from raccoon.utils.utils import json_serial, to_celery_status
from raccoon.interfaces.jenkins import JenkinsInterface


log = get_task_logger(__name__)
connection_string = '{scheme}://{host}:{port}/{db_name}'.format(
    scheme=DB['scheme'],
    host=DB['host'],
    port=DB['port'],
    db_name=DB['name'],
)
celery = Celery('tasks', broker=connection_string, backend=connection_string)
ws = None


def get_ws():
    global ws

    try:
        if not ws:
            ws = create_connection('ws://0.0.0.0:8888/websocket')
        else:
            try:
                ws.ping()
                ws.ping()
            except BrokenPipeError:
                ws = create_connection('ws://0.0.0.0:8888/websocket')
    except ConnectionRefusedError:
        log.error('Connection to raccoon server refused!', exc_info=True)

    return ws


def send(verb, resource, headers=None, body=None):
    ws_connection = get_ws()
    ws_connection.send(json.dumps({
        'verb': verb,
        'resource': resource,
        'headers': headers or {},
        'body': body or {},
    }, default=json_serial))


def broadcast(data):
    ws_connection = get_ws()
    ws_connection.send(json.dumps({
        'verb': 'post',
        'resource': '/api/v1/notifications/broadcast',
        'body': data,
    }, default=json_serial))


def fetch(url, method='GET', body=None, headers=None):
    r = requests.get(url, verify=False)
    print(r)
    body = r.json()
    headers = r.headers
    return body, headers


class BaseTask(Task):
    def __init__(self):
        self.max_retries = None

    def on_retry(self, exc, task_id, args, kwargs, einfo):
        self.update_state(task_id=task_id, state=states.PENDING)


class JenkinsJobWatcherTask(BaseTask):
    def run(self, url, id, api_url, *args, **kwargs):
        parsed_url = urlparse(url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        url = urljoin(api_url, path)

        response, headers = fetch(
            method='GET',
            url=url,
        )

        status = response.get('result') or states.STARTED
        status = to_celery_status(status)

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

        if status in states.READY_STATES:
            return {
                'id': id,
                'status': status,
                'response': response,
            }

        raise self.retry(countdown=5, max_retries=None)

    def on_success(self, retval, task_id, args, kwargs):
        # update status in case of REVOKED
        self.update_state(task_id=task_id, state=retval.get('status'))

        # notify backend that <task_id> finished
        send(
            verb='PUT',
            resource='/api/v1/tasks/{}'.format(retval.get('id')),
            body=retval.get('response'),
        )


class JenkinsQueueWatcherTask(BaseTask):
    def run(self, url, id, api_url, *args, **kwargs):
        parsed_url = urlparse(url)
        path = '{}/api/json'.format(parsed_url.path.strip('/'))
        url = urljoin(api_url, path)

        try:
            response, headers = fetch(
                method='GET',
                url=url,
            )
        except:
            traceback.format_exc()
            raise self.retry(countdown=5, max_retries=None)

        broadcast({
            'verb': 'patch',
            'resource': '/api/v1/tasks/{}'.format(id),
            'data': {
                'id': id,
                'status': states.PENDING,
                'why': response.get('why'),
                'response': response,
            }
        })

        build_url = response.get('executable', {}).get('url')
        if build_url:
            return build_url

        raise self.retry(countdown=5, max_retries=None)


jenkins_queue_watcher = celery.tasks[JenkinsQueueWatcherTask.name]
jenkins_job_watcher = celery.tasks[JenkinsJobWatcherTask.name]

JenkinsInterface.tasks = sys.modules[__name__]


if __name__ == '__main__':
    celery.start()
