import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import (
    TranscriptPhraseCorrection, TranscriptPhraseCorrectionVote,
    TranscriptPhrase
)
from .tasks import calculate_phrase_confidence, calculate_correction_confidence

django_log = logging.getLogger('django')


@receiver(post_save, sender=TranscriptPhraseCorrection)
def self_vote_for_correction(sender, instance, **kwargs):
    TranscriptPhraseCorrectionVote.objects.get_or_create(
        transcript_phrase_correction=instance,
        user=instance.user
    )


@receiver(post_save, sender=TranscriptPhrase)
def update_phrase_confidence(sender, instance, **kwargs):
    calculate_phrase_confidence(instance)


@receiver(post_save, sender=TranscriptPhraseCorrectionVote)
def update_correction_confidence(sender, instance, **kwargs):
    calculate_correction_confidence(instance.transcript_phrase_correction)
