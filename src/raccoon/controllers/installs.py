import logging

from tornado import gen
from mongoengine.errors import DoesNotExist

from . import BaseController
from ..models import Install
from ..utils.decorators import authenticated
from ..utils.exceptions import ReplyError

log = logging.getLogger(__name__)


class InstallsController(BaseController):
    """
    Installs Controller
    """
    model = Install

    @classmethod
    @authenticated
    @gen.coroutine
    def get(cls, request, pk=None, project=None, env=None, *args, **kwargs):
        """
            Fetches all instances of that class, or a specific instance
        if pk is given.

        :param request: client request
        :type request: raccoon.utils.request.Request
        :param pk: primary key of an instance
        :param args: not used
        :param kwargs: not used
        :return: None
        """

        if pk:
            try:
                response = Install.objects.get(id=pk)
            except DoesNotExist:
                raise ReplyError(404)

            response = response.get_dict()
        else:
            query_kw = {}
            if project:
                query_kw['project'] = project
            if env:
                query_kw['environment'] = env

            response = cls.model.objects(**query_kw).order_by('-date_added')[:cls.page_size]
            response = [r.get_dict() for r in response]

        request.send(response)
