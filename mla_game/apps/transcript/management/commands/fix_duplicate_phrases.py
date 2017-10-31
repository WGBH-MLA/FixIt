import logging

from django.core.management.base import BaseCommand

from ...models import (
    Transcript, TranscriptPhrase
)

django_log = logging.getLogger('django')


class Command(BaseCommand):
    help = 'oneoff'

    def handle(self, *args, **options):
        transcripts = Transcript.objects.all()
        for transcript in transcripts:
            for phrase in TranscriptPhrase.objects.filter(transcript=transcript):
                if TranscriptPhrase.objects.filter(transcript=transcript, start_time=phrase.start_time).count() > 1:
                    phrase.delete()
