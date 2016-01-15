from __future__ import absolute_import

import logging

from tornado import gen

from .base import BaseConnector


log = logging.getLogger(__name__)

class GitHubConnector(BaseConnector):

    @gen.coroutine
    def branches(self, project):
        headers = {
            'Authorization': 'token d070518b2d6189eeda4cba01b76943206f2dbaa5',
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