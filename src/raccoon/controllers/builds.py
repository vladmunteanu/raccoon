from __future__ import absolute_import

import logging

from tornado import gen

from raccoon.controllers.base import BaseController
from raccoon.models import Build, Project
from raccoon.interfaces.github import GitHubInterface
from raccoon.utils.decorators import authenticated


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
        project = yield Project.objects.get(id=project_id)
        if not project:
            raise ReplyError(400)

        # connect to github
        yield project.load_references()
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
