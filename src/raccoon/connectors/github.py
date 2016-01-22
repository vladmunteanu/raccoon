from __future__ import absolute_import

import logging

from tornado import gen

from .base import BaseInterface


log = logging.getLogger(__name__)

class GitHubInterface(BaseInterface):

    @gen.coroutine
    def branches(self, project):
        token = project.repo_auth.get('token')
        headers = {
            'Authorization': 'token {}'.format(),
        }

        url = '{api_url}/repos/{repo_name}/branches'.format(
            api_url=project.api_url,
            repo_name=project.repo_name
        )

        response = yield self.fetch(
            url=url,
            headers=headers,
        )

        raise gen.Return(response)

    @gen.coroutine
    def commits(self, project):
        token = project.repo_auth.get('token')
        headers = {
            'Authorization': 'token {}'.format(),
        }

        url = '{api_url}/repos/{repo_name}/commits'.format(
            api_url=project.api_url,
            repo_name=project.repo_name
        )

        response = yield self.fetch(
            url=url,
            headers=headers,
        )

        raise gen.Return(response)