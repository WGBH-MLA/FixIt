import logging
from pprint import pprint
import json

from django.core.management.base import BaseCommand

from ...models import Transcript, TranscriptPhrase, Topic

logger = logging.getLogger('pua_scraper')
stats = logging.getLogger('pua_stats')
error_log = logging.getLogger('pua_errors')


class Command(BaseCommand):
    help = 'oneoff'

    def handle(self, *args, **options):
        t = Transcript.objects.all().first()
        data = t.transcript_data_blob
        if 'audio_files' in data:
            print(data['audio_files'][0]['transcript']['parts'])
