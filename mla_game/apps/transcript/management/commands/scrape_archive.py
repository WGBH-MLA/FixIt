import time
from django.core.management.base import BaseCommand, CommandError
from popuparchive import Client


class Command(BaseCommand):
    help = 'scrapes the popup archive poll for information'

    def handle(self, *args, **options):
        time_start = time.time()
        client = Client('a219ed26d1311ea11fc645072ae530a13ad910cd8ec5ff93db6eb27419f746d1', '5bbea6e637f819aa463d741fae68d2a797728c5c0e636e8322e3c6bbde63685f')
        for collection in client.get_collections():
            for item_id in collection['item_ids']:
                item = client.get_item(collection['id'], item_id)
                if item['audio_files'] is None:
                    print 'skipping %s' % (item_id)
                    continue
                for audio_file in item['audio_files']:
                    if audio_file['transcript'] is None:
                        print 'skipping audio file'
                        continue
                    transcript = audio_file['transcript']
                    if transcript['parts'] is None:
                        print 'skipping transcript'
                        continue
                    for part in transcript['parts']:
                        print part['text']
        print time.time() - time_start