import logging

from mongoengine.errors import DoesNotExist
from tornado import gen

from ..interfaces.github import GitHubInterface
from ...controllers import BaseController
from ...models import Project
from ...utils.decorators import authenticated
from ...utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class GitHubController(BaseController):
    """
    Github Controller

    Request:
    ----------
    {
        "verb": "get",
        "resource": "/api/v1/github/branches",
        "args": {
            "project": "<project_id>"
        },
        "requestId": "abc123",
        "headers": {
            "Authorization": "Bearer <access_token>"
        }
    }

    Response:
    ----------
    {
        "data": {
        },
        "requestId": "abc123",
        "resource": "/api/v1/github/branches",
        "verb": "get"
    }
    """

    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, method=None, project=None, *args, **kwargs):
        try:
            project = Project.objects.get(id=project)
        except DoesNotExist:
            raise ReplyError(422)

        # create GitHub interface & select operation
        github = GitHubInterface(connector=project.connector)
        method = getattr(github, method, None)
        if not method:
            raise ReplyError(404)

        response = yield method(project=project)

        request.send(response)
