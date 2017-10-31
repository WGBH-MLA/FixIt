from django.core.management.base import BaseCommand
from django.db.models import Prefetch

from mla_game.apps.transcript.tasks import update_transcript_stats

from ...models import (
    Transcript, TranscriptPhraseVote, TranscriptPhraseCorrection,
)


class Command(BaseCommand):
    help = '''Find all Transcripts with votes or corrections and update stats for
    that transcript'''

    def handle(self, *args, **options):
        eligible_transcripts = set()
        transcript_qs = Transcript.objects.only('pk')
        downvotes = TranscriptPhraseVote.objects.filter(
            upvote=False
        ).prefetch_related(
            Prefetch('transcript_phrase__transcript', queryset=transcript_qs)
        )

        upvotes = TranscriptPhraseCorrection.objects.all().prefetch_related(
            Prefetch('transcript_phrase__transcript', queryset=transcript_qs)
        )
        eligible_transcripts.update(
            [vote.transcript_phrase.transcript.pk for vote in downvotes]
        )
        eligible_transcripts.update(
            [vote.transcript_phrase.transcript.pk for vote in upvotes]
        )

        transcripts_to_process = Transcript.objects.filter(
            pk__in=eligible_transcripts).only('pk')
        for transcript in transcripts_to_process:
            update_transcript_stats(transcript)
