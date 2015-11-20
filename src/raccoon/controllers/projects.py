from __future__ import absolute_import

import logging
from tornado import gen

from raccoon.controllers.base import BaseController
from raccoon.models import Project
from raccoon.utils.exceptions import ReplyError

log = logging.getLogger(__name__)

class ProjectsController(BaseController):
    """
    Projects Controller
    """

    @classmethod
    @gen.coroutine
    def get(cls, id=None, *args, **kwargs):
        if id:
            response = yield Project.objects.get(id=id)
            if not response:
                raise ReplyError(404)

            response = response.to_son()
        else:
            response = yield Project.objects.find_all()
            response = [r.to_son() for r in response]

        raise gen.Return(response)
