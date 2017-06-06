from django.db import models
from django.contrib.postgres.fields import JSONField


class LoadingScreenData(models.Model):
    '''Holds the data shown at the loading screens'''
    date = models.DateTimeField(auto_now_add=True)
    data = JSONField()
