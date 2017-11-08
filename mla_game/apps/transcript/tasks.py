import logging

from django.conf import settings
from django.core.management import call_command
from django.core.cache import cache
from huey.contrib.djhuey import db_task, db_periodic_task
from huey import crontab

from .models import (
    Transcript, TranscriptPhrase, TranscriptPhraseVote,
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
correction_ineligibility_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_NEGATIVE_CONFIDENCE_LIMIT

django_log = logging.getLogger('django')


def calculate_confidence(upvotes, downvotes):
    total_votes = upvotes + downvotes
    if downvotes == upvotes:
        confidence = 0
    elif upvotes > downvotes:
        confidence = upvotes/total_votes
    elif downvotes > upvotes:
        confidence = -(downvotes/total_votes)
    return confidence


def phrase_is_corrected(phrase):
    corrected = False
    if phrase.confidence >= phrase_positive_limit:
        corrected = True
    else:
        corrections = TranscriptPhraseCorrection.objects.filter(
            transcript_phrase=phrase,
            confidence__gte=correction_lower_limit
        )
        if corrections.count() > 0:
            corrected = True
    return corrected


def game_two_eligible(phrase):
    '''A phrase is in game two if the original phrase has a negative confidence
    score and there are no submitted corrections or all submitted corrections
    have a negative confidence score.'''
    eligible = False
    corrections = TranscriptPhraseCorrection.objects.filter(
        transcript_phrase=phrase
    )
    if (corrections.count() == 0) or (corrections.count() == len(
        [correction.pk for correction in corrections
         if correction.confidence <= correction_ineligibility_limit]
    )):
        eligible = True
    return eligible


def game_three_eligible(phrase):
    '''A phrase can be in game three if it has a correction under the positive
    correction limit but not if a correction exceeds the limit'''
    eligible = False
    corrections = TranscriptPhraseCorrection.objects.filter(
        transcript_phrase=phrase
    )
    votable_corrections = [
        correction.pk for correction in corrections
        if correction.confidence >= correction_ineligibility_limit
        and correction.confidence < correction_lower_limit
    ]
    if len(votable_corrections) > 0:
        eligible = True
    return eligible


@db_task()
def assign_current_game(phrase):
    if phrase_is_corrected(phrase):
        current_game = 0
    elif game_two_eligible(phrase):
        current_game = 2
    elif game_three_eligible(phrase):
        current_game = 3

    if current_game != phrase.current_game:
        phrase.current_game = current_game
        phrase.save()


@db_task()
def calculate_phrase_confidence(phrase):
    downvotes = phrase.downvotes_count
    upvotes = phrase.upvotes_count
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
def process_blob(transcript):
    django_log.info(
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
        django_log.info(
            'bulk processing {} transcript blobs'.format(
                unprocessed_transcripts.count()
            )
        )
        for transcript in unprocessed_transcripts:
            django_log.info(
                'adding transcript {} to the queue'.format(
                    transcript.name
                )
            )
            process_blob(transcript)
    return None


@db_periodic_task(crontab(minute='*/1'))
def scrape_aapb():
    if Transcript.objects.filter(metadata_processed=False).count() > 0:
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


@db_periodic_task(crontab(minute='*/1'))
def update_random_transcript_pool():
    pass


def percent(numerator, denominator):
    return round((numerator / denominator) * 100, 2)


@db_task()
def update_transcript_stats(transcript):
    '''
    This should be triggered for any transcript when the following happens:
        - A phrase gets a vote
        - A phrase gets a correction
        - A correction gets a vote
    '''
    stats = transcript.statistics
    if stats['total_number_of_phrases'] == 0:
        stats['total_number_of_phrases'] = TranscriptPhrase.objects.filter(
            transcript=transcript
        ).count()
        transcript.save()
        return

    transcript_phrases = TranscriptPhrase.objects.filter(
        transcript=transcript).only('pk', 'confidence')
    min_sample_size = settings.MINIMUM_SAMPLE_SIZE
    total_phrases_with_votes = 0
    phrases_approaching_min_sample_size = 0
    positive_scored_phrases = transcript_phrases.filter(confidence__gte=phrase_positive_limit).count()
    negative_scored_phrases = transcript_phrases.filter(confidence__lte=phrase_negative_limit).count()
    phrases_with_corrections = 0
    total_corrections = 0
    usable_corrections = 0

    for phrase in transcript_phrases:
        phrase_corrections = TranscriptPhraseCorrection.objects.filter(
            transcript_phrase=phrase,
        )
        phrase_vote_count = TranscriptPhraseVote.objects.filter(
            upvote__in=[True, False]
        ).count()
        phrase_correction_count = phrase_corrections.count()
        if phrase_vote_count > 0:
            total_phrases_with_votes += 1
        if phrase_vote_count == min_sample_size - 1:
            phrases_approaching_min_sample_size += 1
        if phrase_correction_count > 0:
            phrases_with_corrections += 1
        if phrase.best_correction is not None:
            if phrase.best_correction.confidence > correction_lower_limit:
                usable_corrections += 1
        total_corrections += phrase_correction_count

    stats['phrases_with_votes_percent'] = percent(total_phrases_with_votes, stats['total_number_of_phrases'])
    stats['phrases_close_to_minimum_sample_size_percent'] = percent(phrases_approaching_min_sample_size, stats['total_number_of_phrases'])
    stats['phrases_not_needing_correction_percent'] = percent(positive_scored_phrases, stats['total_number_of_phrases'])
    stats['phrases_needing_correction_percent'] = percent(negative_scored_phrases, stats['total_number_of_phrases'])
    stats['phrases_with_corrections_percent'] = percent(phrases_with_corrections, stats['total_number_of_phrases'])
    stats['corrections_submitted'] = total_corrections
    stats['corrections_accepted'] = usable_corrections
    stats['phrases_ready_for_export'] = positive_scored_phrases + usable_corrections
    stats['percent_complete'] = percent(stats['phrases_ready_for_export'], stats['total_number_of_phrases'])

    if stats['phrases_ready_for_export'] == stats['total_number_of_phrases']:
        transcript.complete = True

    if stats['percent_complete'] != 100:
        transcript.in_progress = True
    else:
        transcript.in_progress = False

    transcript.save()


def update_transcripts_awaiting_stats(phrase_or_correction):
    batch = cache.get('transcripts_awaiting_stats_update', set())
    if type(phrase_or_correction) is TranscriptPhrase:
        transcript = phrase_or_correction.transcript
    elif type(phrase_or_correction) is TranscriptPhraseCorrection:
        transcript = phrase_or_correction.transcript_phrase.transcript
    else:
        return
    batch.add(transcript.pk)
    cache.set('transcripts_awaiting_stats_update', batch, 60*120)


@db_periodic_task(crontab(minute='0', hour='*'))
def process_transcripts_awaiting_stats_update():
    batch = cache.get('transcripts_awaiting_stats_update', set())
    transcripts_to_process = Transcript.objects.filter(pk__in=batch)
    for transcript in transcripts_to_process:
        update_transcript_stats(transcript)
    cache.set('transcripts_awaiting_stats_update', set(), 60 * 120)
