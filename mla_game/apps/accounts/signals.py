import logging

from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.db.models.signals import m2m_changed

from mla_game.apps.transcript.tasks import update_transcripts_awaiting_stats
from mla_game.apps.transcript.models import TranscriptPhrase
from .models import Profile
from .tasks import (
    update_transcript_picks, update_partial_or_complete_transcripts,
    create_explicit_upvotes_from_implied_upvotes,
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
    if action == 'post_add' or action == 'post_remove':
        update_transcript_picks(instance.user)


def considered_phrases_changed(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    if action == 'post_add':
        phrases = [
            phrase for phrase in TranscriptPhrase.objects.filter(pk__in=pk_set)
        ]
        if phrases:
            update_partial_or_complete_transcripts(instance.user, phrases)
            create_explicit_upvotes_from_implied_upvotes(instance.user, phrases)
            update_transcripts_awaiting_stats(phrases[0])


m2m_changed.connect(create_update_transcript_picks_task, sender=Profile.preferred_stations.through)
m2m_changed.connect(create_update_transcript_picks_task, sender=Profile.preferred_topics.through)
m2m_changed.connect(considered_phrases_changed, sender=Profile.considered_phrases.through)
