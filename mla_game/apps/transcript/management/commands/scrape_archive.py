import logging
import time
from datetime import datetime

from django.conf import settings
from django.core.management.base import BaseCommand
from popuparchive.client import Client

from ...tasks import process_transcript
from ...models import Transcript, PopupPage, PopupCollection

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
        stats.info("=" * 80)
        stats.info("Started PUA scraping at {}".format(datetime.now().isoformat()))
        for page in range(1, 50):
            try:
                PopupPage.objects.get(page=page)
            except:
                print(page)
                page_contents = client.get('/collections?page={}'.format(page))
                PopupPage.objects.create(page=page, content=page_contents)

        for page in PopupPage.objects.all():
            if 'collections' in page.content:
                for collection in page.content['collections']:
                    PopupCollection.objects.get_or_create(
                        collection=collection['id'],
                        content=collection['item_ids']
                    )

        for collection in PopupCollection.objects.all():
            for item in collection.content:
                if not all_transcripts.filter(
                        id_number=item, collection_id=collection.collection
                ).exists():
                    time.sleep(5)
                    process_transcript(item, collection.collection)
