from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User)
    preferred_station = models.ForeignKey(
        'transcript.Source',
        default=None,
        null=True,
        blank=True
    )
    preferred_topics = models.ManyToManyField('transcript.Topic')
