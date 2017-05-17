from django.core.management.base import BaseCommand
from django.core.cache import cache

from ...models import Profile

from mla_game.apps.transcript.models import (
    TranscriptPhraseDownvote, TranscriptPhraseCorrection
)


class Command(BaseCommand):
    help = '''If there's not a correction where not_an_error=True for all phrases
    considered and not downvoted by a user, one will be created.
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
                TranscriptPhraseDownvote.objects.filter(
                    user=user.user).select_related('transcript_phrase')
            )
            upvoted = set(
                correction.transcript_phrase for correction in
                TranscriptPhraseCorrection.objects.filter(
                    user=user.user).select_related('transcript_phrase')
            )
            all_voted = downvoted | upvoted
            if all_voted < considered:
                missing = considered - all_voted
                for phrase in missing:
                    TranscriptPhraseCorrection.objects.create(
                        transcript_phrase=phrase,
                        user=user,
                        not_an_error=True
                    )
                    transcripts_to_update.add(phrase.transcript)

        batch = cache.get('transcripts_awaiting_stats_update', set())
        transcripts_to_update.update(batch)
        cache.set(
            'transcripts_awaiting_stats_update',
            transcripts_to_update,
            60 * 120
        )
