from __future__ import absolute_import

import logging
import time

from tornado import gen

from .base import BaseInterface, REGISTERED

log = logging.getLogger(__name__)


class BitbucketInterface(BaseInterface):
    __token = None
    __expire_date = None

    @property
    @gen.coroutine
    def access_token(self):
        if self.__token and time.time() < self.__expire_date:
            raise gen.Return(self.__token)

        client_id = self.connector.config.get('client_id')
        client_secret = self.connector.config.get('client_secret')
        url = self.connector.config.get('url')

        response, _ = yield self.fetch(
            method='POST',
            url='{}/site/oauth2/access_token'.format(url),
            body='grant_type=client_credentials',
            auth_username=client_id,
            auth_password=client_secret,
        )

        self.__token = response.get('access_token')
        self.__expire_date = time.time() + response.get('expires_in')
        raise gen.Return(self.__token)

    @gen.coroutine
    def branches(self, project):
        """
        :return: list of branches in format {
            name: name of the branch
        }
        """
        token = yield self.access_token
        headers = {
            'Authorization': 'Bearer {}'.format(token),
        }

        # https://api.bitbucket.org/2.0/repositories/{USER_NAME}/{REPO_NAME}/refs/branches
        url = '{api_url}/2.0/repositories/{repo_name}/refs/branches'.format(
            api_url=project.api_url,
            repo_name=project.repo_name,
        )

        response, _ = yield self.fetch(
            url=url,
            headers=headers,
        )

        # extract needed information from response
        branches = []
        values = response.get('values')
        if values:
            for item in values:
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
        token = yield self.access_token
        headers = {
            'Authorization': 'Bearer {}'.format(token),
        }

        # https://api.bitbucket.org/2.0/repositories/{USER_NAME}/{REPO_NAME}/commits/master
        url = '{api_url}/2.0/repositories/{repo_name}/commits/{branch}'.format(
            api_url=project.api_url,
            repo_name=project.repo_name,
            branch=branch,
        )

        response, _ = yield self.fetch(
            url=url,
            headers=headers,
        )

        # extract needed information from response
        commits = []
        values = response.get('values')
        if values:
            for item in values:
                author_raw = item['author']['raw'].strip('>')
                author_name, author_email = author_raw.split(' <')
                commits.append({
                    'sha': item['hash'],
                    'message': item['message'],
                    'date': item['date'],
                    'url': item['links']['html']['href'],
                    'author': {
                        'name': author_name,
                        'email': author_email,
                    }
                })

        raise gen.Return(commits)


REGISTERED['bitbucket'] = BitbucketInterface
