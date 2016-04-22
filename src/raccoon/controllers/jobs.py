from __future__ import absolute_import

import logging

from raccoon.controllers.base import BaseController
from raccoon.models import Job

log = logging.getLogger(__name__)

class JobsController(BaseController):
    """
    Jobs Controller
    """
    model = Job

