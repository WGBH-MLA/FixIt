from .base import *
import os

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mla',
        'USER': 'root',
        'PASSWORD': '',
        'TEST': {
            'NAME': 'mla-test',
        },
    },
}
