from .base import *
import os

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = True

LOG_DIRECTORY = '/home/wgbh/logs'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {'read_default_file': '/home/wgbh/.my-stage.cnf'},
    },
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '{}/django.log'.format(LOG_DIRECTORY),
        },
        'pua_scraper': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '{}/pua_scraper.log'.format(LOG_DIRECTORY),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'pua_scraper': {
            'handlers': ['pua_scraper'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
