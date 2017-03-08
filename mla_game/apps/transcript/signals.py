import logging

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import (
    TranscriptPhraseCorrection, TranscriptPhraseCorrectionVote,
    TranscriptPhraseDownvote, TranscriptPhrase
)
from .tasks import calculate_phrase_confidence, calculate_correction_confidence

django_log = logging.getLogger('django')

min_samples = settings.MINIMUM_SAMPLE_SIZE


@receiver(post_save, sender=TranscriptPhraseCorrection)
def self_vote_for_correction(sender, instance, **kwargs):
    TranscriptPhraseCorrectionVote.objects.get_or_create(
        transcript_phrase_correction=instance,
        user=instance.user
    )


@receiver(post_save)
def update_phrase_confidence(sender, instance, **kwargs):
    if sender.__name__ in ('TranscriptPhraseDownvote', 'TranscriptPhraseCorrection'):
        downvotes = TranscriptPhraseDownvote.objects.filter(
            transcript_phrase=instance.transcript_phrase).count()
        upvotes = TranscriptPhraseCorrection.objects.filter(
            transcript_phrase=instance.transcript_phrase, not_an_error=True).count()
        sample_size = downvotes + upvotes
        if sample_size > min_samples:
            calculate_phrase_confidence(instance.transcript_phrase)


@receiver(post_save, sender=TranscriptPhraseCorrection)
def update_num_corrections(sender, instance, **kwargs):
    if instance.not_an_error is False:
        corrections = TranscriptPhraseCorrection.objects.filter(
            transcript_phrase=instance.transcript_phrase,
            not_an_error=False
        ).count()
        django_log.info('updating phrase {} with {} corrections'.format(
            instance.transcript_phrase, corrections
        ))
        TranscriptPhrase.objects.filter(
            pk=instance.transcript_phrase.pk).update(num_corrections=corrections)


@receiver(post_save, sender=TranscriptPhraseCorrectionVote)
def update_correction_confidence(sender, instance, **kwargs):
    sample_size = TranscriptPhraseCorrectionVote.objects.filter(
        transcript_phrase_correction=instance.transcript_phrase_correction
    ).count()
    if sample_size > min_samples:
        calculate_correction_confidence(instance.transcript_phrase_correction)
