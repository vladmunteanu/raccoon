from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)

class ProjectsController(BaseController):
    """
    Projects Controller
    """

    dummy_reponse = [
            {
                'id': 'applogic',
                'name': 'Applogic',
                'date_added': '2012-10-11 10:00 PM',
            },
            {
                'id': 'webserver',
                'name': 'Webserver',
                'date_added': '2012-10-12 10:00 PM',
            },
            {
                'id': 'mya',
                'name': 'My Account',
                'date_added': '2012-10-12 11:00 PM',
            }
        ]

    @classmethod
    def all(self):
        return self.dummy_reponse

    @classmethod
    def get(cls, id=None, *args, **kwargs):
        response = cls.dummy_reponse

        if id:
            for project in response:
                if project.get('id') == id:
                    return project

            raise ReplyError(404)

        return response
