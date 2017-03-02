import random

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from ...models import (
    TranscriptPhraseCorrection, TranscriptPhraseCorrectionVote
)


class Command(BaseCommand):
    help = 'oneoff'

    def handle(self, *args, **options):
        users = User.objects.all()
        corrections = TranscriptPhraseCorrection.objects.all()
        for correction in corrections:
            for user in users:
                choice = random.choice([True, False])
                TranscriptPhraseCorrectionVote.objects.create(
                    user=user,
                    transcript_phrase_correction=correction,
                    upvote=choice
                )
