import random

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from ...models import (
    Transcript, TranscriptPhraseVote
)
from ...tasks import update_transcript_stats


class Command(BaseCommand):
    help = 'Creates random votes for 5 phrases in a random transcript'

    def handle(self, *args, **options):
        users = User.objects.all()
        transcript = Transcript.objects.random_transcript(in_progress=False).first()
        phrases = transcript.phrases.all()[:5]
        for phrase in phrases:
            for user in users:
                TranscriptPhraseVote.objects.create(
                    transcript_phrase=phrase,
                    user=user,
                    upvote=random.choice([True, False])
                )
        update_transcript_stats(transcript)
