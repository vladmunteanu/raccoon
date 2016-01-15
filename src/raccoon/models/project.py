from __future__ import absolute_import

from urllib.parse import urlparse

from motorengine import StringField, DateTimeField, URLField
from raccoon.utils.dbfields import DictField
from raccoon.models import BaseModel

class Project(BaseModel):
    __collection__ = 'projects'

    name = StringField(required=True, unique=True)
    label = StringField(required=True, unique=True)
    repo_url = URLField(required=True)
    repo_type = StringField(required=True, default='GIT')
    repo_auth = DictField(default={})
    date_added = DateTimeField(required=True, auto_now_on_insert=True)

    @property
    def repo_name(self):
        name = urlparse(self.repo_url).path.strip('/')
        return name

    @property
    def api_url(self):
        parse = urlparse(self.repo_url)
        netloc = parse.netloc
        path = 'api/v3'

        # GitHub api url is different than GitHub Enterprise
        if parse.hostname == 'github.com':
            netloc = 'api.github.com'
            path = ''

        url = '{scheme}://{netloc}/{path}'.format(
            scheme=parse.scheme,
            netloc=netloc,
            path=path,
        ).strip('/')
        return url
