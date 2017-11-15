import os

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.cache import cache
from django.db.models import Prefetch

from mla_game.apps.transcript.tasks import (
    calculate_phrase_confidence, calculate_correction_confidence,
    process_transcripts_awaiting_stats_update,
)
from mla_game.apps.accounts.models import Profile

from ...models import (
    Transcript, TranscriptPhrase, TranscriptPhraseVote,
    TranscriptPhraseVote, TranscriptPhraseCorrection,
    TranscriptPhraseCorrectionVote
)


class Command(BaseCommand):
    help = '''Deletes all votes, corrections, and non-staff users;
    resets all phrase confidence ratings to zero'''

    def handle(self, *args, **options):
        if os.environ['DJANGO_SETTINGS_MODULE'] == 'mla_game.settings.prod':
            print('You cannot run this in production')

        else:
            TranscriptPhraseVote.objects.all().delete()
            TranscriptPhraseCorrectionVote.objects.all().delete()
            TranscriptPhraseCorrection.objects.all().delete()
            TranscriptPhrase.objects.all().update(current_game=1, confidence=0.00)

            User.objects.filter(is_staff=False).delete()
