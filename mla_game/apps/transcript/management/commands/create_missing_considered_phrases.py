import logging

from django.core.management.base import BaseCommand
from django.core.cache import cache

from mla_game.apps.accounts.models import Profile

from ...models import TranscriptPhraseDownvote

django_log = logging.getLogger('django')
logger = logging.getLogger('pua_scraper')
stats = logging.getLogger('pua_stats')
error_log = logging.getLogger('pua_errors')


class Command(BaseCommand):
    help = '''If there's not a considered phrase for every downvote, a considered
    phrase should be created.
    '''

    def handle(self, *args, **options):
        transcripts_to_update = set()
        users = Profile.objects.all()
        for user in users:
            considered = set(
                phrase for phrase in
                user.considered_phrases.all().only('pk')
            )
            downvoted = set(
                downvote.transcript_phrase for downvote in
                TranscriptPhraseDownvote.objects.filter(user=user.user).select_related('transcript_phrase')
            )
            if not downvoted.issubset(considered):
                missing_phrases = downvoted - considered
                user.considered_phrases.add(*missing_phrases)
                transcripts_to_update.update(
                    set(phrase.transcript for phrase in missing_phrases)
                )
        batch = cache.get('transcripts_awaiting_stats_update', set())
        transcripts_to_update.update(batch)
        cache.set(
            'transcripts_awaiting_stats_update',
            transcripts_to_update,
            60 * 120
        )
