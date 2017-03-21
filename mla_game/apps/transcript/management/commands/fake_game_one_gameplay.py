import random

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from mla_game.apps.accounts.models import Profile

from ...models import (
    Transcript, TranscriptPhraseDownvote
)


class Command(BaseCommand):
    help = 'Creates random votes for all phrases in a random transcript'

    def handle(self, *args, **options):
        users = User.objects.all()
        transcript = Transcript.objects.random_transcript().first()
        for phrase in transcript.phrases.all():
            for user in users:
                profile = Profile.objects.get(user=user)
                profile.considered_phrases.add(phrase)
                if random.choice([True, False]):
                    TranscriptPhraseDownvote.objects.create(
                        transcript_phrase=phrase,
                        user=user
                    )
