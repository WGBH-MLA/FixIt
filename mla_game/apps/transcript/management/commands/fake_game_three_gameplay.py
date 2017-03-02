import logging
import random
# import time
# import datetime
# from pprint import pprint
# import json

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings

from popuparchive.client import Client

from mla_game.apps.transcript.tasks import process_transcript, calculate_confidence
from mla_game.apps.accounts.tasks import update_transcript_picks, update_leaderboard
from mla_game.apps.accounts.models import Profile, Score
from mla_game.apps.api.serializers import TranscriptSerializer

from ...models import (
    Transcript, TranscriptPhrase, Topic, PopupCollection, Source,
    TranscriptPhraseDownvote, TranscriptPhraseCorrection,
    TranscriptPhraseCorrectionVote
)

django_log = logging.getLogger('django')
logger = logging.getLogger('pua_scraper')
stats = logging.getLogger('pua_stats')
error_log = logging.getLogger('pua_errors')

# client = Client(
#     settings.PUA_KEY,
#     settings.PUA_SECRET
# )


class Command(BaseCommand):
    help = 'oneoff'

    def handle(self, *args, **options):
        users = User.objects.all()
        corrections = TranscriptPhraseCorrection.objects.all()
        for correction in corrections:
            print(correction)
            for user in users:
                choice = random.choice([True, False])
                print('{} chose {}'.format(user, choice))
                TranscriptPhraseCorrectionVote.objects.create(
                    user=user,
                    transcript_phrase_correction=correction,
                    upvote=choice
                )

            print('\n\n')
