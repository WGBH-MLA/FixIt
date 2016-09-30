import logging
from datetime import datetime

from django.conf import settings
from django.core.management.base import BaseCommand
from popuparchive.client import Client

from ...tasks import process_transcript
from ...models import Transcript

logger = logging.getLogger('pua_scraper')
stats = logging.getLogger('pua_stats')


class Command(BaseCommand):
    help = 'scrapes the popup archive poll for information'

    def handle(self, *args, **options):
        all_transcripts = Transcript.objects.all().defer('transcript_data_blob')
        client = Client(
            settings.PUA_KEY,
            settings.PUA_SECRET,
        )
        all_collections = []
        stats.info("=" * 80)
        stats.info("Started PUA scraping at {}".format(datetime.now().isoformat()))
        for page in range(1, 50):
            for collection in client.get(
                '/collections?page={}'.format(page)
            )['collections']:
                logger.info('processing collection id: ' + str(collection['id']))
                all_collections.append(
                    {'collection': collection['id'],
                     'items': collection['item_ids']}
                )
                stats.info('{},{}'.format(
                    str(collection['id']),
                    len(collection['item_ids']))
                )
        for collection in all_collections:
            for item in collection['items']:
                if not all_transcripts.filter(
                    id_number=item, collection_id=collection['collection']
                ).exists():
                    process_transcript(item, collection['collection'])
