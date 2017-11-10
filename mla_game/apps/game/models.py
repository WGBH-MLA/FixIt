from django.db import models
from django.contrib.postgres.fields import JSONField

from markdownx.models import MarkdownxField


class LoadingScreenData(models.Model):
    '''Holds the data shown at the loading screens'''
    date = models.DateTimeField(auto_now_add=True)
    data = JSONField()


class Message(models.Model):
    '''Messages from admins to be presented to the user.'''
    active = models.BooleanField(default=False)
    message = MarkdownxField()

    def save(self, *args, **kwargs):
        super(Message, self).save(*args, **kwargs)
        if self.active:
            Message.objects.exclude(pk=self.pk).update(active=False)
