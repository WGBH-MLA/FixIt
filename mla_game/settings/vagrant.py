from .base import *
import os

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = True

ALLOWED_HOSTS = ['mlagame-dev.wgbhdigital.org']

LOG_DIRECTORY = '/home/vagrant/logs'

STATIC_ROOT = '/var/nginx/webroot/static'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mla',
        'OPTIONS': {
            'read_default_file': '/home/vagrant/.my.cnf'
        },
        'TEST': {
            'NAME': 'mla-test',
        },
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
        'pua_errors': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '{}/pua_errors.log'.format(LOG_DIRECTORY),
        },
        'pua_stats': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '{}/pua_stats.csv'.format(LOG_DIRECTORY),
        },
        'metadata_errors': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '{}/metadata_error.log'.format(LOG_DIRECTORY),
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
        'pua_errors': {
            'handlers': ['pua_errors'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'pua_stats': {
            'handlers': ['pua_stats'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'metadata_errors': {
            'handlers': ['metadata_errors'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
