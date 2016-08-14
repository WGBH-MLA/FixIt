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
            logger.info('collection id: ' + str(collection['id']))
            for item_id in collection['item_ids']:
                logger.info('item id: ' + str(item_id))
                item = client.get_item(collection['id'], item_id)
                process_transcript(item)
