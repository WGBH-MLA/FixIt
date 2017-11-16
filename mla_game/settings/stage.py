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
