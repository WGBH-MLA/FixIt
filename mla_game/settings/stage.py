from .base import *
import os

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = True

LOG_DIRECTORY = '/home/wgbh/logs'

STATIC_ROOT = '/home/wgbh/webroot/static'

ALLOWED_HOSTS = ['mlagame-dev.wgbhdigital.org', 'mlagame.wgbhdigital.org']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {'read_default_file': '/home/wgbh/.my-stage.cnf'},
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
    },
}
