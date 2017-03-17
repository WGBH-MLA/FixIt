from .base import *
import os

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = True

GA_CODE = 'nada'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'mla',
        'USER': 'mla',
        'PASSWORD': os.environ['PG_PASS'],
        'TEST': {
            'NAME': 'mla-test',
        },
    },
}
