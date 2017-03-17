from .base import *
import os

INSTALLED_APPS += ('storages',)

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = False

ALLOWED_HOSTS = ['fixit.americanarchive.org', 'fixit.wgbh-mla.org']

LOG_DIRECTORY = '/home/wgbh/logs'

PUA_CACHE_DIRECTORY = '/home/wgbh/pua_cache/'

GA_CODE = os.environ['GA_CODE']

AWS_HEADERS = {
    'Expires': 'Thu, 31 Dec 2099 20:00:00 GMT',
    'Cache-Control': 'max-age=94608000',
}
AWS_STORAGE_BUCKET_NAME = os.environ['S3_BUCKET_NAME']
AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']

AWS_S3_CUSTOM_DOMAIN = 's3.amazonaws.com/{}'.format(
    AWS_STORAGE_BUCKET_NAME
)

STATIC_URL = 'https://s3.amazonaws.com/{}/'.format(AWS_S3_CUSTOM_DOMAIN)
STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = (
    'rest_framework.renderers.JSONRenderer',
)

NEWRELIC_CONFIG_PATH = os.environ('NEWRELIC_CONFIG_PATH')
NEWRELIC_ENV = os.environ('NEWRELIC_ENV')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': os.environ['PG_HOST'],
        'NAME': 'fixit',
        'USER': 'wgbh',
        'PASSWORD': os.environ['PG_PASS'],
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
