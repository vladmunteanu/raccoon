import logging

from tornado import gen

from raccoon.external.interfaces import BaseInterface, REGISTERED

log = logging.getLogger(__name__)


class GitHubInterface(BaseInterface):

    @gen.coroutine
    def branches(self, project, **kwargs):
        """
            Fetches the list of branches for a project, from GitHub.

        :param project: Project instance
        :type project: raccoon.models.project.Project
        :return: list of branches in format [{name: name of the branch}, {...}]
        :rtype: list
        """
        token = self.connector.config.get('token')
        headers = {
            'Authorization': 'token {}'.format(token),
            'User-Agent': "raccoon/1.0.0",
        }

        url = '{api_url}/repos/{repo_name}/branches'.format(
            api_url=project.api_url,
            repo_name=project.repo_name
        )

        response, _ = yield self.fetch(
            url=url,
            headers=headers,
        )

        # Get all branches by traversing pages
        link_header = _.get('Link')
        while link_header:
            links = link_header.split(',')
            new_link = None
            for link in links:
                href, rel = link.split(';')
                href = href.strip('<>')
                rel = rel.strip()
                if rel == 'rel="next"':
                    page_response, page_headers = yield self.fetch(
                        url=href,
                        headers=headers
                    )
                    response.extend(page_response)
                    new_link = page_headers.get('Link')

            if not new_link or new_link == link_header:
                break
            link_header = new_link

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
            Fetches the list of commits for a project and branch, from GitHub.
        Commit format:
            {
                sha: some hash,
                message: commit message,
                date: date of the commit,
                url: link to the html commit,
                author: {
                    name: name of the commit author,
                    email: email address of the commit author
                }
            }


        :param project: Project instance
        :type project: raccoon.models.project.Project
        :param branch: Git branch name
        :type branch: str
        :return: list of git commits
        :rtype: list
        """
        token = self.connector.config.get('token')
        headers = {
            'Authorization': 'token {}'.format(token),
            'User-Agent': "raccoon/1.0.0",
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
