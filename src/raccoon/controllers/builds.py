import logging

from tornado import gen
from mongoengine.errors import DoesNotExist

from . import BaseController
from ..models import Build, Project
from ..interfaces.github import GitHubInterface
from ..utils.decorators import authenticated
from ..utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class BuildsController(BaseController):
    """
    Builds Controller
    """
    model = Build

    @classmethod
    @authenticated
    @gen.coroutine
    def post(cls, request, *args, **kwargs):
        project_id = kwargs.get('project')
        branch_name = kwargs.get('branch')

        # get project
        try:
            project = Project.objects.get(id=project_id)
        except DoesNotExist:
            raise ReplyError(400)

        # connect to github
        github = GitHubInterface(project.connector)

        # get commits and create changelog
        commits = yield github.commits(project=project, branch=branch_name)
        changelog = []
        for item in commits:
            changelog.append({
                'message': item['commit']['message'],
                'date': item['commit']['committer']['date'],
                'url': item['html_url'],
                'author': {
                    'name': item['commit']['committer']['name'],
                    'email': item['commit']['committer']['email'],
                }
            })

        # pass changelog
        kwargs['changelog'] = changelog
        super().post(request, *args, **kwargs)
