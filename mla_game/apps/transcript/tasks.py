import logging

from huey.contrib.djhuey import db_task, db_periodic_task, crontab

from .models import Transcript


logger = logging.getLogger('pua_scraper')


@db_task()
def process_transcript(transcript):
    new_transcript = Transcript.objects.create_transcript(transcript)
    if new_transcript is None:
        logger.info('transcript is none')
        return None
    new_transcript.save()
    logger.info('transcript saved')
    return None


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
