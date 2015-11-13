from __future__ import absolute_import

from motorengine.connection import connect
import tornado

from raccoon.utils.imports import import_submodules


# Connect to Mongo Server
io_loop = tornado.ioloop.IOLoop.instance()
connect("test", host="10.2.1.77", port=27017, io_loop=io_loop)

# Import all submodules
#import_submodules(globals(), __name__, __path__)
