from django.core.management.base import BaseCommand
from popuparchive.client import Client

from ...models import Transcript


class Command(BaseCommand):
    help = 'scrapes the popup archive poll for information'

    def handle(self, *args, **options):
        client = Client(
            'a219ed26d1311ea11fc645072ae530a13ad910cd8ec5ff93db6eb27419f746d1',
            '5bbea6e637f819aa463d741fae68d2a797728c5c0e636e8322e3c6bbde63685f'
        )
        for collection in client.get_collections():
            print('collection id: ' + str(collection['id']))
            for item_id in collection['item_ids']:
                print('item id: ' + str(item_id))
                item = client.get_item(collection['id'], item_id)
                transcript = Transcript.objects.create_transcript(item)
                if transcript is None:
                    print('transcript is none')
                    continue
                transcript.save()
                print('transcript saved')
                transcript.process_transcript_data_blob()
                print('transcript blob processed')
