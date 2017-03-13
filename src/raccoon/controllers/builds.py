import logging

from mongoengine.errors import DoesNotExist
from tornado import gen

from . import BaseController
from ..models import Build, Project
from ..utils.decorators import authenticated
from ..utils.exceptions import ReplyError
from ..external.interfaces.github import GitHubInterface

log = logging.getLogger(__name__)


class BuildsController(BaseController):
    """
    Builds Controller
    """
    model = Build

    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, pk=None, project=None, *args, **kwargs):
        """
            Fetches all builds, or a specific instance if pk is given.

        :param request: client request
        :type request: raccoon.utils.request.Request
        :param pk: primary key of an instance
        :param project: project id to be used in filter
        :param args: not used
        :param kwargs: not used
        :return: None
        """

        if pk:
            try:
                response = Build.objects.get(id=pk)
            except DoesNotExist:
                raise ReplyError(404)

            response = response.get_dict()
        else:
            query_kw = {}
            if project:
                query_kw['project'] = project

            response = cls.model.objects(**query_kw).order_by('-date_added')[:cls.page_size]
            response = [r.get_dict() for r in response]

        request.send(response)

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
