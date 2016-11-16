import datetime
from urllib.parse import urlparse

from mongoengine import StringField, DateTimeField, URLField, ReferenceField
from mongoengine import IntField, DictField

from . import BaseModel, Connector


class Project(BaseModel):

    name = StringField(required=True, unique=True)
    label = StringField(required=True, unique=True)
    repo_url = URLField(required=True)
    version = StringField(default='1.0.0')
    connector = ReferenceField(document_type=Connector, required=True)
    metadata = DictField()
    date_added = DateTimeField(required=True, default=datetime.datetime.now)

    # Counter will automatically update on each build
    build_counter = IntField(default=0)

    @property
    def repo_name(self):
        """
        :return: string like "<username>/<repo>"
        """
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
        elif parse.hostname == 'bitbucket.org':
            netloc = 'api.bitbucket.org'
            path = ''

        url = '{scheme}://{netloc}/{path}'.format(
            scheme=parse.scheme,
            netloc=netloc,
            path=path,
        ).strip('/')
        return url
