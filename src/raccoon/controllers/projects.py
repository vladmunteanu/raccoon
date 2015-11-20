from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController

log = logging.getLogger(__name__)

class ProjectsController(BaseController):
    """
    Projects Controller
    """

    def get(self):
        return [
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