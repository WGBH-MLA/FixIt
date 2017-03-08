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

from mla_game.apps.accounts.tasks import (
    phrase_confidence_exceeds_positive_threshold,
    phrase_confidence_recedes_from_positive_threshold,
    phrase_confidence_exceeds_negative_threshold,
    phrase_confidence_recedes_from_negative_threshold,
    correction_confidence_exceeds_positive_threshold,
    correction_confidence_recedes_from_positive_threshold,
)

min_samples = settings.MINIMUM_SAMPLE_SIZE
phrase_positive_limit = settings.TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT
phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT
correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT

django_log = logging.getLogger('django')
logger = logging.getLogger('pua_scraper')
error_log = logging.getLogger('pua_errors')


def calculate_confidence(upvotes, downvotes):
    total_votes = upvotes + downvotes
    if downvotes == upvotes:
        confidence = 0
    elif upvotes > downvotes:
        confidence = upvotes/total_votes
    elif downvotes > upvotes:
        confidence = -(downvotes/total_votes)
    return confidence


@db_task()
def calculate_phrase_confidence(phrase):
    # todo: reconcile considerations and game two upvotes
    # create a correction for every considered phrase
    downvotes = phrase.downvotes_count
    upvotes = TranscriptPhraseCorrection.objects.filter(
        transcript_phrase=phrase,
        not_an_error=True
    ).count()
    original_confidence = phrase.confidence
    new_confidence = calculate_confidence(upvotes, downvotes)

    TranscriptPhrase.objects.filter(pk=phrase.pk).update(confidence=new_confidence)

    # scenario A
    if new_confidence >= phrase_positive_limit:
        phrase_confidence_exceeds_positive_threshold(phrase)

    # scenario C
    if new_confidence <= phrase_negative_limit:
        phrase_confidence_exceeds_negative_threshold(phrase)

    # scenario B
    if original_confidence >= phrase_positive_limit and new_confidence < phrase_positive_limit:
        phrase_confidence_recedes_from_positive_threshold(phrase)

    # scenario D
    if original_confidence <= phrase_negative_limit and new_confidence > phrase_negative_limit:
        phrase_confidence_recedes_from_negative_threshold(phrase)


@db_task()
def calculate_correction_confidence(correction):
    original_confidence = correction.confidence
    votes = TranscriptPhraseCorrectionVote.objects.filter(
        transcript_phrase_correction=correction
    )
    upvotes = votes.filter(upvote=True).count()
    downvotes = votes.count() - upvotes
    new_confidence = calculate_confidence(upvotes, downvotes)

    TranscriptPhraseCorrection.objects.filter(
        pk=correction.pk).update(confidence=new_confidence)

    if new_confidence >= correction_lower_limit:
        correction_confidence_exceeds_positive_threshold(correction)

    if original_confidence >= correction_lower_limit and new_confidence < correction_lower_limit:
        correction_confidence_recedes_from_positive_threshold(correction)


# correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT
# correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT


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
