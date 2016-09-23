import logging

from django.conf import settings
from django.core.management.base import BaseCommand
from popuparchive.client import Client

from ...models import Transcript
from ...tasks import process_transcript


logger = logging.getLogger('pua_scraper')
stats = logging.getLogger('pua_stats')


class Command(BaseCommand):
    help = 'scrapes the popup archive poll for information'

    def handle(self, *args, **options):
        client = Client(
            settings.PUA_KEY,
            settings.PUA_SECRET,
        )
        for page in range(1, 50):
            for collection in client.get(
                '/collections?page={}'.format(page)
            )['collections']:
                logger.info('processing collection id: ' + str(collection['id']))
                stats.info('{},{}'.format(
                    str(collection['id']),
                    len(collection['item_ids']))
                )
                for item_id in collection['item_ids']:
                    logger.info('processing item id: ' + str(item_id))
                    try:
                        Transcript.objects.get(id_number=item_id)
                    except Transcript.DoesNotExist:
                        item = client.get_item(collection['id'], item_id)
                        process_transcript(item)
