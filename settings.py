from __future__ import absolute_import

import os


PORT = 8888
ROOT_PATH = os.path.dirname(__file__)

DB = {
    'scheme': 'mongodb',
    'host': '10.2.101.51',
    'port': 27017,
    'name': 'raccoon',
}

DEBUG = True
STATIC_PATH = os.path.join(ROOT_PATH, 'web')
TEMPLATE_PATH = os.path.join(ROOT_PATH, 'web')

APP = {
    'static_path': STATIC_PATH,
    'template_path': TEMPLATE_PATH,
    'debug': DEBUG,
}

SECRET = 'secret'
