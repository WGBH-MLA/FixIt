from django.core.management.base import BaseCommand
from django.core.cache import cache
from django.db.models import Prefetch

from mla_game.apps.transcript.tasks import (
    calculate_phrase_confidence, calculate_correction_confidence,
    process_transcripts_awaiting_stats_update,
)

from ...models import (
    Transcript, TranscriptPhrase,
    TranscriptPhraseVote, TranscriptPhraseCorrection,
)


class Command(BaseCommand):
    help = '''Recalculate all stats:
            - Transcript statistics
            - Phrase confidence
            - Correction confidence'''

    def handle(self, *args, **options):
        transcript_qs = Transcript.objects.only('pk')
        phrase_qs = TranscriptPhrase.objects.only('pk').prefetch_related(
            Prefetch('transcript', queryset=transcript_qs)
        )

        all_phrase_downvotes = TranscriptPhraseVote.objects.all(
            ).prefetch_related(Prefetch('transcript_phrase', queryset=phrase_qs))

        all_phrase_upvotes = TranscriptPhraseCorrection.objects.filter(
            not_an_error=True
        ).prefetch_related(Prefetch('transcript_phrase', queryset=phrase_qs))

        phrases_to_recalculate = set(
            [vote.transcript_phrase for vote in all_phrase_downvotes] +
            [vote.transcript_phrase for vote in all_phrase_upvotes]
        )
        corrections_to_recalculate = TranscriptPhraseCorrection.objects.filter(
            not_an_error=False
        )

        transcripts_to_recalculate = set(
            [phrase.transcript for phrase in phrases_to_recalculate] +
            [correction.transcript_phrase.transcript
             for correction in corrections_to_recalculate]
        )
        for phrase in phrases_to_recalculate:
            calculate_phrase_confidence(phrase)

        for correction in corrections_to_recalculate:
            calculate_correction_confidence(correction)

        cache.set(
            'process_transcripts_awaiting_stats_update',
            transcripts_to_recalculate,
            60*120
        )

        process_transcripts_awaiting_stats_update()
