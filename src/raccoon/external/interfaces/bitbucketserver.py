import logging

from tornado import gen

from raccoon.external.interfaces import BaseInterface, REGISTERED

log = logging.getLogger(__name__)


class BitbucketServerInterface(BaseInterface):
    __token = None
    __expire_date = None

    @gen.coroutine
    def branches(self, project):
        """
        :return: list of branches in format {
            name: name of the branch
        }
        """
        token = self.connector.config.get('token')
        project_name = self.connector.config.get('project')
        bitbucket_repo = project['metadata']['repo_name']
        headers = {
            'Authorization': 'Bearer {}'.format(token),
            'User-Agent': "raccoon/1.0.0",
        }
        url = '{}/rest/api/1.0/projects/{}/repos/{}/branches?limit=100'.format(
            project.api_url,
            project_name,
            bitbucket_repo
        )
        response, _ = yield self.fetch(
            url=url,
            headers=headers,
        )

        # extract needed information from response
        branches = []
        for item in response['values']:
            branches.append({
                'name': item.get('displayId')
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
        project_name = self.connector.config.get('project')
        bitbucket_repo = project['metadata']['repo_name']
        headers = {
            'Authorization': 'Bearer {}'.format(token),
        }

        # https://api.bitbucket.org/2.0/repositories/{USER_NAME}/{REPO_NAME}/commits/master
        url = '{}/rest/api/1.0/projects/{}/repos/{}/commits?limit=25&until=refs/heads/{}'.format(
            project.api_url,
            project_name,
            bitbucket_repo,
            branch
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
                if 'displayName' in item['author']:
                    author_name = item['author']['displayName']
                else:
                    author_name = item['author']['name']
                author_email = item['author']['emailAddress']
                commit_url = "{}/projects/{}/repos/{}/commits/{}".format(
                    project.api_url,
                    project_name,
                    bitbucket_repo,
                    item['id']
                )
                commits.append({
                    'sha': item['displayId'],
                    'message': item['message'],
                    'date': item['authorTimestamp'],
                    'url': commit_url,
                    'author': {
                        'name': author_name,
                        'email': author_email,
                    }
                })

        raise gen.Return(commits)


REGISTERED['bitbucketserver'] = BitbucketServerInterface
