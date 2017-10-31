from .base import *
import os

# how many data points are enough to calculate confidence?
MINIMUM_SAMPLE_SIZE = 3

# original phrase is good enough for export
TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT = .51
# original phrase needs correction
TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT = -.51

# correction is good enough to award points and export data
TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT = .51
# correction no longer needs votes and can replace original phrase
TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT = .66

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = True

ALLOWED_HOSTS = ['mlagame-dev.wgbhdigital.org']

LOG_DIRECTORY = '/home/vagrant/logs'

STATIC_ROOT = '/var/nginx/webroot/static'

GA_CODE = 'none'

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

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '{}/django.log'.format(LOG_DIRECTORY),
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
        'metadata_errors': {
            'handlers': ['metadata_errors'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
