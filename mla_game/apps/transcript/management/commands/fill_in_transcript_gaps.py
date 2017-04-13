import logging
from django.core.management.base import BaseCommand
from django.db.models import Prefetch

from ...models import (
    Transcript, TranscriptPhrase
)

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
            new_phrases = []
            for index, phrase in phrases:
                try:
                    phrase_pairs.append(
                        (phrase, phrases[index+1][1])
                    )
                except:
                    pass

            for pair in phrase_pairs:
                delta = pair[1].start_time - pair[0].end_time
                if delta > 3 and delta < 30:
                    new_phrases.append(
                        TranscriptPhrase(
                            id_number=0,
                            text='',
                            start_time=pair[0].end_time,
                            end_time=pair[1].start_time,
                            speaker_id=0,
                            transcript=transcript
                        )
                    )
                elif delta >= 30:
                    split = round(delta/15)
                    length = round(delta/split, 2)
                    next_phrase_start_time = pair[0].end_time
                    for i in range(split):
                        end_time = next_phrase_start_time + length
                        if end_time > pair[1].start_time:
                            end_time = pair[1].start_time
                        new_phrases.append(
                            TranscriptPhrase(
                                id_number=0,
                                text='',
                                start_time=next_phrase_start_time,
                                end_time=end_time,
                                speaker_id=0,
                                transcript=transcript
                            )
                        )
                        next_phrase_start_time += length

            django_log.info('Creating {} phrases for transcript {}'.format(
                len(new_phrases), transcript
            ))
            TranscriptPhrase.objects.bulk_create(new_phrases)
