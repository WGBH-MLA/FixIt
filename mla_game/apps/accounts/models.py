from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User)
    username = models.CharField(max_length=50, default='')
    preferred_stations = models.ManyToManyField('transcript.Source')
    preferred_topics = models.ManyToManyField('transcript.Topic')
    considered_phrases = models.ManyToManyField('transcript.TranscriptPhrase')

    def __str__(self):
        return self.user.username
