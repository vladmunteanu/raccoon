import logging

from tornado import gen

from .base import BaseInterface


class SaltStackInterface(BaseInterface):
    """Interface for the SaltStack API"""

    def __init__(self, connector):
        super().__init__(connector)

        self.username = connector.config.get('username')
        self.password = connector.config.get('password')

        self.api_url = connector.config.get('url')

    @gen.coroutine
    def get_config(self):
        headers = {
            'Accept': 'application/json'
        }

        data = {
            'username': self.username,
            'password': self.password,
            'eauth': 'pam',
            'fun': 'test.ping',
            'tgt': '*'
        }
        response, headers = yield self.fetch(url=self.api_url, method='POST')

        print(response)
        pass

    @gen.coroutine
    def set_config(self):
        pass
