import logging
import base64
from urllib import parse

from tornado import gen

from raccoon.external.interfaces import BaseInterface, REGISTERED

log = logging.getLogger(__name__)


class SaltStackInterface(BaseInterface):
    """ Interface for the SaltStack API """

    def __init__(self, connector):
        super().__init__(connector)

        self.username = connector.config.get('username')
        self.password = connector.config.get('password')

        self.api_url = connector.config.get('url')

    @gen.coroutine
    def run(self, fun=None, eauth='pam', tgt=None, **kwargs):
        """
        Runs a command on Salt, and returns the result.

        :param fun: command to run, defaults to None
        :param eauth: authentication method, defaults to 'pam'
        :param tgt: target minions, defaults to None
        :return: command result
        """

        headers = {
            'Accept': 'application/json',
        }

        payload = {
            'username': self.username,
            'password': self.password,
            'eauth': eauth,
            'client': 'runner',
            'fun': fun,
        }

        # add additional arguments
        payload.update(kwargs)

        if tgt is not None:
            payload['tgt'] = tgt

        if 'config_data' in payload:
            payload['config_data'] = base64.b64encode(
                bytes(payload['config_data'], 'utf-8')
            )

        response, _ = yield self.fetch(
            url=self.api_url,
            headers=headers,
            body=parse.urlencode(payload),
            method='POST',
            follow_redirects=False,
            timeout=120
        )

        raise gen.Return(response)

REGISTERED['salt'] = SaltStackInterface
