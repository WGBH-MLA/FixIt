import json
import logging
import sys

from django.conf import settings
from django.core.management import call_command
from huey.contrib.djhuey import db_task, db_periodic_task, crontab
from popuparchive.client import Client

from .models import (
    Transcript, TranscriptPhrase,
    TranscriptPhraseCorrection, TranscriptPhraseCorrectionVote
)

django_log = logging.getLogger('django')
logger = logging.getLogger('pua_scraper')
error_log = logging.getLogger('pua_errors')


@db_task()
def calculate_correction_confidence(correction):
    votes = TranscriptPhraseCorrectionVote.objects.filter(
        transcript_phrase_correction=correction
    )
    upvotes = votes.filter(upvote=True).count()
    downvotes = votes.count() - upvotes
    total_votes = votes.count()
    if downvotes == 0:
        confidence = 1
    elif upvotes > downvotes:
        confidence = upvotes / total_votes
    elif downvotes > upvotes:
        confidence = -(downvotes / total_votes)
    elif downvotes == upvotes:
        confidence = 0

    django_log.info(
        'Correction: {}\nUp: {}\nDown: {}\nConfidence: {}\n\n'.format(
            correction,
            upvotes,
            downvotes,
            confidence
        )
    )
    TranscriptPhraseCorrection.objects.filter(
        pk=correction.pk).update(confidence=confidence)


@db_task()
def calculate_phrase_confidence(phrase):
    # todo: reconcile considerations and game two upvotes
    downvotes = phrase.downvotes_count
    considerations = phrase.considered_by_count
    game_two_upvotes = TranscriptPhraseCorrection.objects.filter(
        transcript_phrase=phrase,
        not_an_error=True
    ).count()
    total_votes = considerations + game_two_upvotes
    upvotes = total_votes - downvotes
    if downvotes == upvotes:
        confidence = 0
    elif downvotes == 0:
        confidence = 1
    elif upvotes > downvotes:
        confidence = upvotes/total_votes
    elif downvotes > upvotes:
        confidence = -(downvotes/total_votes)
    django_log.info(
        'Phrase: {}\nUp: {}\nDown: {}\nConfidence: {}\n\n'.format(
            phrase,
            upvotes,
            downvotes,
            confidence
        )
    )
    TranscriptPhrase.objects.filter(pk=phrase.pk).update(confidence=confidence)


@db_task()
def process_transcript(item_id, collection_id):
    client = Client(
        settings.PUA_KEY,
        settings.PUA_SECRET,
    )
    try:
        transcript_data = client.get_item(collection_id, item_id)
        new_transcript = Transcript(
            name=transcript_data['title'],
            id_number=transcript_data['id'],
            collection_id=transcript_data['collection_id'],
            url=json.dumps(transcript_data['urls']),
            transcript_data_blob=transcript_data
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
    return None


@db_periodic_task(crontab(minute='*/1'))
def create_process_blob_tasks():
    unprocessed_transcripts = Transcript.objects.filter(
        data_blob_processed=False
    )[:100]
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
    return None


@db_periodic_task(crontab(minute='*/1'))
def scrape_aapb():
    call_command('get_aapb_metadata')
