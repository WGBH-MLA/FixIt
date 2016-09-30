import json
import logging
import sys

from django.conf import settings
from huey.contrib.djhuey import db_task, db_periodic_task, crontab
from popuparchive.client import Client

from .models import Transcript

logger = logging.getLogger('pua_scraper')
error_log = logging.getLogger('pua_errors')


@db_task()
def process_transcript(item_id, collection_id):
    client = Client(
        settings.PUA_KEY,
        settings.PUA_SECRET,
    )
    transcript_data = client.get_item(collection_id, item_id)
    try:
        new_transcript = Transcript(
            name=transcript_data['title'],
            id_number=transcript_data['id'],
            collection_id=transcript_data['collection_id'],
            url=json.dumps(transcript_data['urls']),
            transcript_data_blob=json.dumps(transcript_data)
        )
        new_transcript.save()
    except:
        error_log.info('=' * 80)
        error_log.info(
            'Could not make transcript from item {} in collection {}'.format(
                item_id, collection_id)
        )
        error_log.info(sys.exc_info())


@db_task()
def process_blob(transcript):
    logger.info(
        'starting to process blob for {}'.format(
            transcript.name
        )
    )
    transcript.process_transcript_data_blob()
    logger.info('transcript blob processed')
    return None


@db_periodic_task(crontab(minute='*/1'))
def create_process_blob_tasks():
    unprocessed_transcripts = Transcript.objects.filter(
        data_blob_processesed=False
    )
    if unprocessed_transcripts:
        logger.info(
            'bulk processing {} transcript blobs'.format(
                unprocessed_transcripts.count()
            )
        )
        for transcript in unprocessed_transcripts:
            logger.info(
                'adding transcript {} to the queue'.format(
                    transcript.name
                )
            )
            process_blob(transcript)
            transcript.data_blob_processesed = True
            transcript.save()
    return None
