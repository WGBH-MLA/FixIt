from .base import *
import os

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = True

LOG_DIRECTORY = '/home/wgbh/logs'

STATIC_ROOT = '/home/wgbh/webroot/static'

ALLOWED_HOSTS = [
    'mlagame-dev.wgbhdigital.org', 'mlagame.wgbhdigital.org',
    'fixit.wgbhdigital.org',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': 'localhost',
        'NAME': 'mla',
        'USER': 'mla',
        'PASSWORD': os.environ['PG_PASS'],
        'TEST': {
            'NAME': 'mla-test',
        },
    },
}

GA_CODE = 'null'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '{}/django.log'.format(LOG_DIRECTORY),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
