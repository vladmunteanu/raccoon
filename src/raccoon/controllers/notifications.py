import logging

from tornado import gen

from raccoon.controllers import BaseController
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class NotificationsController(BaseController):
    """
        Notifications Controller

        Request:
        ----------
        {
            "verb": "post",
            "resource": "/api/v1/notifications/broadcast",
            "body": {
                "verb": "post",
                "resource": "/api/v1/projects/",
                "body": {}
            }
        }

        Response:
        ----------
        200 OK

    """

    @classmethod
    @gen.coroutine
    def get(cls, request, *args, **kwargs):
        raise ReplyError(405)

    @classmethod
    @gen.coroutine
    def post(cls, request, *args, **kwargs):
        request.verb = request.data.get('body', {}).get('verb')
        request.resource = request.data.get('body', {}).get('resource')
        request.broadcast(request.data.get('body', {}).get('data', {}))

    @classmethod
    @gen.coroutine
    def put(cls, request, *args, **kwargs):
        raise ReplyError(405)

    @classmethod
    @gen.coroutine
    def delete(cls, request, *args, **kwargs):
        raise ReplyError(405)
