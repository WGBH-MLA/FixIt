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
        transcript = Transcript.objects.random()
        for phrase in transcript.phrases.all():
            django_log.info('Phrase: {}'.format(phrase))
            for user in users:
                profile = Profile.objects.get(user=user)
                profile.considered_phrases.add(phrase)
                if random.choice([True, False]):
                    django_log.info('{} votes down'.format(profile.username))
                    TranscriptPhraseDownvote.objects.create(
                        transcript_phrase=phrase,
                        user=user
                    )
                else:
                    django_log.info('{} votes up'.format(profile.username))
            django_log.info('\n\n')
