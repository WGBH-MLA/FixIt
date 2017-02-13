from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import TranscriptPhraseCorrection, TranscriptPhraseCorrectionVote


@receiver(post_save, sender=TranscriptPhraseCorrection)
def self_vote_for_correction(sender, instance, **kwargs):
    TranscriptPhraseCorrectionVote.objects.get_or_create(
        transcript_phrase_correction=instance,
        user=instance.user
    )
