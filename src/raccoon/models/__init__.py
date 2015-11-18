from __future__ import absolute_import

from motorengine.connection import connect
import tornado

from raccoon.utils.imports import import_submodules


# Connect to Mongo Server
io_loop = tornado.ioloop.IOLoop.instance()
connect("test", host="10.2.1.77", port=27017, io_loop=io_loop)

# Import all submodules
# import_submodules(globals(), __name__, __path__)

#!important keep order
# no dep
from .auditlog import *
from .connector import *
from .environment import *
from .project import *
from .right import *

from .build import *
from .install import *
from .method import *
from .action import *
from .user import *

