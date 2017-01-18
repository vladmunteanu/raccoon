from os import path

HOST = ""
PORT = 8888
ROOT_PATH = path.abspath(path.join(path.dirname(__file__), '../..'))

DB = {
    'scheme': 'mongodb',
    'host': '127.0.0.1',
    'port': 27017,
    'name': 'raccoon'
}

DEBUG = True
STATIC_PATH = path.join(ROOT_PATH, 'web')
TEMPLATE_PATH = path.join(ROOT_PATH, 'web')

# Enable and config LDAP authentication
LDAP_AUTH = False
LDAP_CONF = {
    'uri': '<ldap://uri>',
    'port': 3268
}

APP = {
    'static_path': STATIC_PATH,
    'template_path': TEMPLATE_PATH,
    'debug': DEBUG,
}

SECRET = 'secret'
