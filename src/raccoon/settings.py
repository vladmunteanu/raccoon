from __future__ import absolute_import

from os import path

HOST = ""
PORT = 8888
ROOT_PATH = path.abspath(path.join(path.dirname(__file__), '../..'))

DB = {
    'scheme': 'mongodb',
    'host': '10.2.101.51',
    # 'host': '10.2.101.108',
    'port': 27017,
    'name': 'raccoon',
}

DEBUG = True
STATIC_PATH = path.join(ROOT_PATH, 'web')
TEMPLATE_PATH = path.join(ROOT_PATH, 'web')


LDAP_AUTH = True
LDAP_CONF = {
    'uri': 'ldap://krusty.ad.avira.com',
    'port': 3268
}

APP = {
    'static_path': STATIC_PATH,
    'template_path': TEMPLATE_PATH,
    'debug': DEBUG,
}

SECRET = 'secret'
