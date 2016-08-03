from __future__ import absolute_import

import logging

from tornado import gen

from .base import BaseInterface, REGISTERED

log = logging.getLogger(__name__)


class GitHubInterface(BaseInterface):

    @gen.coroutine
    def branches(self, project):
        """
        :return: list of branches in format {
            name: name of the branch
        }
        """
        token = self.connector.config.get('token')
        headers = {
            'Authorization': 'token {}'.format(token),
        }

        url = '{api_url}/repos/{repo_name}/branches'.format(
            api_url=project.api_url,
            repo_name=project.repo_name
        )

        response, _ = yield self.fetch(
            url=url,
            headers=headers,
        )

        # extract needed information from response
        branches = []
        for item in response:
            branches.append({
                'name': item.get('name')
            })

        raise gen.Return(branches)

    @gen.coroutine
    def commits(self, project, branch='master'):
        """
        :return: list of commits in format {
            sha: some hash,
            message: commit message,
            date: date of the commit,
            url: link to the html commit,
            author: {
                name: name of the commit author,
                email: email address of the commit author
            }
        }
        """
        token = self.connector.config.get('token')
        headers = {
            'Authorization': 'token {}'.format(token),
        }

        url = '{api_url}/repos/{repo_name}/commits?sha={branch}'.format(
            api_url=project.api_url,
            repo_name=project.repo_name,
            branch=branch
        )

        response, _ = yield self.fetch(
            url=url,
            headers=headers,
        )

        # extract needed information from response
        commits = []
        for item in response:
            commits.append({
                'sha': item['sha'],
                'message': item['commit']['message'],
                'date': item['commit']['committer']['date'],
                'url': item['html_url'],
                'author': {
                    'name': item['commit']['committer']['name'],
                    'email': item['commit']['committer']['email'],
                }
            })

        raise gen.Return(commits)


REGISTERED['github'] = GitHubInterface
