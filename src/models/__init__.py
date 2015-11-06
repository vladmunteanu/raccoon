from motorengine.connection import connect
import tornado



io_loop = tornado.ioloop.IOLoop.instance()
connect("test", host="10.2.2.185", port=27017, io_loop=io_loop)

