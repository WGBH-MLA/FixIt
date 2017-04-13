import requests
import logging

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

phrase_positive_limit = settings.TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT
phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT

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
    downvotes = phrase.downvotes_count
    upvotes = TranscriptPhraseCorrection.objects.filter(
        transcript_phrase=phrase,
        not_an_error=True
    ).count()
    original_confidence = phrase.confidence
    new_confidence = calculate_confidence(upvotes, downvotes)

    TranscriptPhrase.objects.filter(pk=phrase.pk).update(confidence=new_confidence)

    if new_confidence >= phrase_positive_limit:
        phrase_confidence_exceeds_positive_threshold(phrase)

    if new_confidence <= phrase_negative_limit:
        phrase_confidence_exceeds_negative_threshold(phrase)

    if original_confidence >= phrase_positive_limit and new_confidence < phrase_positive_limit:
        phrase_confidence_recedes_from_positive_threshold(phrase)

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


@db_task()
def process_transcript(item_id, collection_id):
    client = Client(
        settings.PUA_KEY,
        settings.PUA_SECRET,
    )
    transcript_data = client.get_item(collection_id, item_id)
    if transcript_data.status_code == requests.codes.ok:
        try:
            transcript_data = transcript_data.json()
            new_transcript = Transcript(
                name=transcript_data['title'],
                id_number=transcript_data['id'],
                asset_name='',
                collection_id=transcript_data['collection_id'],
                url=transcript_data['urls'],
                transcript_data_blob=transcript_data
            )
            new_transcript.save()
        except:
            error_log.info('=' * 80)
            error_log.info(
                'Could not make transcript from item {} in collection {}'.format(
                    item_id, collection_id)
            )
    else:
        error_log.info('=' * 80)
        error_log.info(
            'Failed to get item {} in collection {} - error code {}'.format(
                item_id, collection_id, transcript_data.status_code
            )
        )


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
    if Transcript.objects.filter('metadata_processed').count() > 0:
        call_command('get_aapb_metadata')


@db_task()
def create_blank_phrases(transcript, phrase_pairs):
    'Creates new empty TranscriptPhrase objects for gaps in timecode'
    new_phrases = []
    for pair in phrase_pairs:
        delta = pair[1].start_time - pair[0].end_time
        if delta > 3 and delta < 30:
            new_phrases.append(
                TranscriptPhrase(
                    id_number=0,
                    text='',
                    start_time=pair[0].end_time,
                    end_time=pair[1].start_time,
                    speaker_id=0,
                    transcript=transcript
                )
            )
        elif delta >= 30:
            split = round(delta/15)
            length = round(delta/split, 2)
            next_phrase_start_time = pair[0].end_time
            for i in range(split):
                end_time = next_phrase_start_time + length
                if end_time > pair[1].start_time:
                    end_time = pair[1].start_time
                new_phrases.append(
                    TranscriptPhrase(
                        id_number=0,
                        text='',
                        start_time=next_phrase_start_time,
                        end_time=end_time,
                        speaker_id=0,
                        transcript=transcript
                    )
                )
                next_phrase_start_time += length

    if len(new_phrases) > 0:
        django_log.info('Creating {} phrases for transcript {}'.format(
            len(new_phrases), transcript
        ))
        TranscriptPhrase.objects.bulk_create(new_phrases)
