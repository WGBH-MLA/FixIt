import logging

from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.db.models.signals import m2m_changed, post_save

from mla_game.apps.transcript.tasks import update_transcripts_awaiting_stats
from mla_game.apps.transcript.models import TranscriptPhrase
from .models import Profile
from .tasks import (
    update_transcript_picks, update_partial_or_complete_transcripts,
)

django_log = logging.getLogger('django')


@receiver(user_logged_in)
def get_or_create_profile(sender, user, request, **kwargs):
    profile, created = Profile.objects.get_or_create(
        user=user
    )
    if created:
        profile.username = user.username
        profile.save()
    return profile


def create_update_transcript_picks_task(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    if action in ['post_add', 'post_remove', 'post_clear']:
        update_transcript_picks(instance.user)


@receiver(post_save)
def user_voted(sender, instance, created, raw, using, update_fields, **kwargs):
    if sender.__name__ == 'TranscriptPhraseVote':
        update_partial_or_complete_transcripts(instance.user)
        update_transcripts_awaiting_stats(instance.phrase)


m2m_changed.connect(
    create_update_transcript_picks_task,
    sender=Profile.preferred_stations.through
)
m2m_changed.connect(
    create_update_transcript_picks_task,
    sender=Profile.preferred_topics.through
)
