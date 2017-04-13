import logging
from django.core.management.base import BaseCommand
from django.db.models import Prefetch

from ...models import (
    Transcript, TranscriptPhrase
)
from ...tasks import create_blank_phrases

django_log = logging.getLogger('django')


class Command(BaseCommand):
    help = 'Fills in gaps in transcript timecode with empty phrases.'

    def handle(self, *args, **kwargs):
        phrase_qs = TranscriptPhrase.objects.defer(
            'text', 'id_number', 'speaker_id', 'confidence', 'num_corrections'
        )
        transcripts = Transcript.objects.all().defer(
            'transcript_data_blob').prefetch_related(
                Prefetch('phrases', queryset=phrase_qs)
            )

        for transcript in transcripts:
            phrases = list(enumerate(transcript.phrases.all()))
            phrase_pairs = []
            for index, phrase in phrases:
                try:
                    phrase_pairs.append(
                        (phrase, phrases[index+1][1])
                    )
                except:
                    pass
            create_blank_phrases(transcript, phrase_pairs)
