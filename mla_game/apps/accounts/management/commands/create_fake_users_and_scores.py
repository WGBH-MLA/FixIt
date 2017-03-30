import random
import datetime

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from mla_game.apps.accounts.tasks import update_leaderboard
from mla_game.apps.accounts.models import Profile, Score


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
             for x in range(0, 14)]
        )

    def handle(self, *args, **options):
        for username in self.fake_users:
            print(username)
            user, _ = User.objects.get_or_create(username=username)
            profile, _ = Profile.objects.get_or_create(user=user, username=user.username)
            for i in range(0, 10):
                s = Score(
                    user=user,
                    score=random.choice([1, 10, 100]),
                    game=random.choice([1, 2, 3]),
                    date=self._random_date()
                )
                s.save()
        update_leaderboard()
