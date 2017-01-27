import logging
import random
import time
import datetime
from pprint import pprint
import json

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings

from popuparchive.client import Client

from mla_game.apps.accounts.tasks import update_transcript_picks, update_leaderboard
from mla_game.apps.accounts.models import Profile, Score
from mla_game.apps.api.serializers import TranscriptSerializer

django_log = logging.getLogger('django')
logger = logging.getLogger('pua_scraper')
stats = logging.getLogger('pua_stats')
error_log = logging.getLogger('pua_errors')


class Command(BaseCommand):
    help = 'oneoff'
    fake_users = [
        'wgbh.broadband',
        'coldsteel_the_hedgehog',
        'arthur_read',
        'leeloo_dallas',
        'hercule_poirot',
        'yellow_hat',
        'carmen_sandiego',
        'peep',
        'hal_9000',
        'alexander_delarge',
        'doctor_strangelove',
        'barry_lyndon',
        'seymore_glass',
        'karl_pilkington',
        'jack_d_ripper',
    ]

    def _random_date(self):
        return random.choice(
            [datetime.date.today() - datetime.timedelta(days=x)
             for x in range(0, 366)]
        )

    def handle(self, *args, **options):
        for username in self.fake_users:
            print(username)
            user, _ = User.objects.get_or_create(username=username)
            profile, _ = Profile.objects.get_or_create(user=user, username=user.username)
            for i in range(0, 3000):
                s = Score(
                    user=user,
                    score=random.choice([1, 10, 100]),
                    game=random.choice([1, 2, 3]),
                    date=self._random_date()
                )
                s.save()
        update_leaderboard()
