import logging
from django.core.management.base import BaseCommand
from django.conf import settings
from popuparchive.client import Client

from ...models import Transcript
from ...tasks import process_transcript


logger = logging.getLogger('pua_scraper')


class Command(BaseCommand):
    help = 'scrapes the popup archive poll for information'

    def handle(self, *args, **options):
        client = Client(
            settings.PUA_KEY,
            settings.PUA_SECRET,
        )
        for collection in client.get_collections():
            logger.info('processing collection id: ' + str(collection['id']))
            for item_id in collection['item_ids']:
                logger.info('processing item id: ' + str(item_id))
                try:
                    Transcript.objects.get(id_number=item_id)
                except Transcript.DoesNotExist:
                    item = client.get_item(collection['id'], item_id)
                    process_transcript(item)
