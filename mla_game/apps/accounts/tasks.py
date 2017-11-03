import logging
import datetime
import itertools

from django.contrib.auth.models import User
from django.db.models import Prefetch

from huey.contrib.djhuey import db_periodic_task, db_task
from huey import crontab

from .models import (
    Profile, TranscriptPicks, Score, Leaderboard, ContributionStatistics,
)
from mla_game.apps.transcript.models import (
    Transcript, TranscriptPhrase, TranscriptPhraseCorrection,
    TranscriptPhraseCorrectionVote, TranscriptPhraseVote,
)

django_log = logging.getLogger('django')
score_log = logging.getLogger('scores')


@db_task()
def update_partial_or_complete_transcripts(user, **kwargs):
    '''
    This task gets triggered whenever a user votes on a TranscriptPhrase

    When a user votes on a phrase in game one, the vote is recorded
    and the set of votes and the current game of each phrase in the transcript
    is used to determine a list of partially and fully completed transcripts.

    If a transcript gets added to the completed transcripts, we trigger
    update_transcript_picks so it gets removed from transcripts user will see.
    '''
    transcript_picks, created = TranscriptPicks.objects.get_or_create(user=user)
    picks = transcript_picks.picks

    transcript_qs = Transcript.objects.only('pk').distinct()

    considered_phrases = TranscriptPhrase.objects.filter(
        pk__in=[vote.transcript_phrase.pk for vote in
                TranscriptPhraseVote.objects.filter(user=user)]
    )

    partial_transcripts = set(
        [phrase.transcript.pk for phrase in
         considered_phrases.prefetch_related(
             Prefetch('transcript', queryset=transcript_qs)
         )]
    )

    if 'completed_transcripts' in picks:
        completed_transcripts = picks['completed_transcripts']
    else:
        completed_transcripts = []

    completed_transcripts_original = completed_transcripts[:]

    for transcript in partial_transcripts:
        all_phrases = TranscriptPhrase.objects.filter(
            transcript=transcript
        ).only('pk', 'current_game')
        seen = []
        unseen = []
        for phrase in all_phrases:
            if phrase in considered_phrases or phrase.current_game != 1:
                seen.append(phrase)
            else:
                unseen.append(phrase)

        if len(seen) == len(all_phrases):
            completed_transcripts.append(transcript)

    picks['partially_completed_transcripts'] = [
        transcript for transcript in partial_transcripts
        if transcript not in completed_transcripts
    ]
    picks['completed_transcripts'] = list(set(completed_transcripts))

    transcript_picks.save()

    if picks['completed_transcripts'] != completed_transcripts_original:
        update_transcript_picks(user)


@db_task()
def update_transcript_picks(user, **kwargs):
    '''
    When a user updates their preferred topics or stations, we need to create
    lists of 'ideal' (matches both) and 'acceptable' (matches either)
    transcripts.
    '''
    profile = Profile.objects.get(user=user)

    transcript_picks, created = TranscriptPicks.objects.get_or_create(user=user)
    if created:
        return

    picks = transcript_picks.picks

    transcript_qs = Transcript.objects.only('pk')

    if profile.preferred_stations.all():
        stations = profile.preferred_stations.all().prefetch_related(
            Prefetch(
                'transcripts', queryset=transcript_qs,
                to_attr='station_transcript_list'
            )
        )
        transcript_pk_list = [
            transcript.pk for transcript in
            list(itertools.chain.from_iterable(
                station.station_transcript_list for station in stations
            ))
        ]
        station_transcripts = Transcript.objects.filter(
            pk__in=transcript_pk_list
        ).only('pk')
    else:
        station_transcripts = Transcript.objects.none()

    if profile.preferred_topics.all():
        topics = profile.preferred_topics.all().prefetch_related(
            Prefetch(
                'transcripts', queryset=transcript_qs,
                to_attr='topic_transcript_list'
            )
        )
        transcript_pk_list = [
            transcript.pk for transcript in
            list(itertools.chain.from_iterable(
                topic.topic_transcript_list for topic in topics
            ))
        ]
        topic_transcripts = Transcript.objects.filter(
            pk__in=transcript_pk_list
        ).only('pk')
    else:
        topic_transcripts = Transcript.objects.none()

    if 'completed_transcripts' in picks:
        completed_transcripts = picks['completed_transcripts']
    else:
        completed_transcripts = []

    if 'skipped_transcripts' in picks:
        skipped_transcripts = picks['skipped_transcripts']
    else:
        skipped_transcripts = []

    ineligible_transcripts = completed_transcripts + skipped_transcripts

    picks['station_transcripts'] = [
        transcript.pk for transcript in station_transcripts
        if transcript.pk not in ineligible_transcripts
    ]
    picks['topic_transcripts'] = [
        transcript.pk for transcript in topic_transcripts
        if transcript.pk not in ineligible_transcripts
    ]
    picks['ideal_transcripts'] = list(
        set(picks['station_transcripts']).intersection(
            set(picks['topic_transcripts'])
        ))
    picks['acceptable_transcripts'] = [
        t for t in picks['station_transcripts'] + picks['topic_transcripts']
        if t not in picks['ideal_transcripts']
    ]

    eligible_transcripts = picks['ideal_transcripts'] + picks['acceptable_transcripts']

    if 'partially_completed_transcripts' in picks:
        for transcript in picks['partially_completed_transcripts']:
            if transcript not in eligible_transcripts:
                picks['partially_completed_transcripts'].remove(transcript)
                if 'auto_skipped_transcripts' not in picks:
                    picks['auto_skipped_transcripts'] = []
                picks['auto_skipped_transcripts'].append(transcript)

    if 'auto_skipped_transcripts' in picks:
        for transcript in picks['auto_skipped_transcripts']:
            if transcript in eligible_transcripts:
                picks['auto_skipped_transcripts'].remove(transcript)
                picks['partially_completed_transcripts'].append(transcript)

    transcript_picks.save()


@db_periodic_task(crontab(minute='0', hour='*/2'))
def update_leaderboard():
    leaderboard = {}
    all_score_objects = []

    today = datetime.date.today()
    one_week_ago = today - datetime.timedelta(days=7)
    one_month_ago = today - datetime.timedelta(days=30)

    all_scores = Score.objects.all()
    all_users = User.objects.all()

    for user in all_users:
        username = Profile.objects.get(user=user).username
        all_user_scores = all_scores.filter(user=user)
        weekly_scores = all_user_scores.filter(
            date__gte=one_week_ago
        )
        monthly_scores = all_user_scores.filter(
            date__gte=one_month_ago
        )
        total_score = sum(score.score for score in all_user_scores)
        weekly_total = sum(
            score.score for score in weekly_scores
        )
        monthly_total = sum(
            score.score for score in monthly_scores
        )
        game_one_total = sum(
            score.score for score in all_user_scores.filter(game=1)
        )
        game_two_total = sum(
            score.score for score in all_user_scores.filter(game=2)
        )
        game_three_total = sum(
            score.score for score in all_user_scores.filter(game=3)
        )
        all_score_objects.append(
            {
                'username': username,
                'total_score': total_score,
                'weekly_total': weekly_total,
                'monthly_total': monthly_total,
                'game_one_total': game_one_total,
                'game_two_total': game_two_total,
                'game_three_total': game_three_total
             }
        )

    all_time_top_scores = sorted(
        all_score_objects,
        key=lambda so: so['total_score'],
        reverse=True
    )[:5]

    past_month_top_scores = sorted(
        all_score_objects,
        key=lambda so: so['monthly_total'],
        reverse=True
    )[:5]

    past_week_top_scores = sorted(
        all_score_objects,
        key=lambda so: so['weekly_total'],
        reverse=True
    )[:5]

    game_one_all_time_top_scores = sorted(
        all_score_objects,
        key=lambda so: so['game_one_total'],
        reverse=True
    )[:5]

    game_two_all_time_top_scores = sorted(
        all_score_objects,
        key=lambda so: so['game_two_total'],
        reverse=True
    )[:5]

    game_three_all_time_top_scores = sorted(
        all_score_objects,
        key=lambda so: so['game_three_total'],
        reverse=True
    )[:5]

    leaderboard['all_time'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['total_score']
        } for rank, top_score in enumerate(all_time_top_scores, start=1)
    ]

    leaderboard['past_month'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['monthly_total']
        } for rank, top_score in enumerate(past_month_top_scores, start=1)
    ]

    leaderboard['past_week'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['weekly_total']
        } for rank, top_score in enumerate(past_week_top_scores, start=1)
    ]

    leaderboard['game_one_all_time'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['game_one_total']
        } for rank, top_score in enumerate(game_one_all_time_top_scores, start=1)
    ]

    leaderboard['game_two_all_time'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['game_two_total']
        } for rank, top_score in enumerate(game_two_all_time_top_scores, start=1)
    ]

    leaderboard['game_three_all_time'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['game_three_total']
        } for rank, top_score in enumerate(game_three_all_time_top_scores, start=1)
    ]

    Leaderboard.objects.create(leaderboard=leaderboard)


@db_periodic_task(crontab(minute='0', hour='*/2'))
def update_contribution_stats():
    stats = {}

    players = Profile.objects.all().count()

    phrase_votes_count = TranscriptPhraseVote.objects.filter(upvote__in=[True, False]).count()

    correction_votes_count = TranscriptPhraseCorrectionVote.objects.all().count()

    corrections_count = TranscriptPhraseCorrection.objects.all().count()

    stats['players'] = players
    stats['phrase_votes'] = phrase_votes_count
    stats['correction_votes'] = correction_votes_count
    stats['corrections_submitted'] = corrections_count
    stats['avg_phrase_votes_per_user'] = phrase_votes_count / players
    stats['avg_corrections_per_user'] = corrections_count / players
    stats['avg_correction_votes_per_user'] = correction_votes_count / players

    ContributionStatistics.objects.create(statistics=stats)


@db_task()
def phrase_confidence_exceeds_positive_threshold(phrase):
    '''
    Triggered when the confidence of a TranscriptPhrase reaches above some set
    threshold, and each time the confidence changes and stays above the
    threshold.

    Awards points:
        +10 for users who upvoted
        -5 for users who downvoted
    '''
    upvoters = [
        vote.user for vote in
        TranscriptPhraseVote.objects.filter(
            transcript_phrase=phrase, upvote=True
        )
    ]
    downvoters = [
        vote.user for vote in
        TranscriptPhraseVote.objects.filter(
            transcript_phrase=phrase,
            upvote=False
        )
    ]

    for user in upvoters:
        score, created = Score.objects.get_or_create(
            user=user,
            score=10,
            phrase=phrase,
            justification=3
        )
        if created:
            score_log.info(
                'User {} got 10 points for helping phrase {} exceed positive '
                'threshold'.format(
                    user, phrase
                )
            )
    for user in downvoters:
        score, created = Score.objects.get_or_create(
            user=user,
            score=-5,
            phrase=phrase,
            justification=3
        )
        if created:
            score_log.info(
                'User {} got 10 points for helping phrase {} exceed positive '
                'threshold'.format(
                    user, phrase
                )
            )


@db_task()
def phrase_confidence_recedes_from_positive_threshold(phrase):
    '''
    Triggered when confidence in a TranscriptPhrase recedes from the threshold
    after exceeding it.

    Revokes points from phrase_confidence_exceeds_positive_threshold.
    '''
    score_log.info('Revoking scores for {} - fell below +threshold'.format(phrase))
    Score.objects.filter(
        phrase=phrase,
        justification=3
    ).delete()


@db_task()
def phrase_confidence_exceeds_negative_threshold(phrase):
    '''
    Triggered when confidence in a TranscriptPhrase exceeds the negative
    threshold, and each time the confidence changes and continues to exceed
    the negative threshold.

    Awards points:
        -5 points for users who upvoted

    Points for users who contributed to negative confidence rating are awarded
    in correction_confidence_exceeds_positive_threshold.
    '''
    upvoters = [
        vote.user for vote in
        TranscriptPhraseVote.objects.filter(
            transcript_phrase=phrase, upvote=True
        )
    ]
    for user in upvoters:
        Score.objects.get_or_create(
            user=user,
            score=-5,
            phrase=phrase,
            justification=2
        )


@db_task()
def phrase_confidence_recedes_from_negative_threshold(phrase):
    '''
    Triggered when confidence in a Transcript phrase recedes from the negative
    threshold after exceeding it.

    Revoked points from phrase_confidence_exceeds_negative_threshold.
    '''
    Score.objects.filter(
        phrase=phrase,
        justification=2
    ).delete()


@db_task()
def correction_confidence_exceeds_positive_threshold(correction):
    '''
    Triggered when confidence in a correction exceeds the positive threshold.

    Awards points:
        10 points to user who authored the correction
        -5 points to users who authored competing corrections

        10 points to users who upvoted the correction
        -5 points to users who downvoted the correction

        10 points to users who downvoted original TranscriptPhrase
        -5 points to users who upvoted original TranscriptPhrase
    '''
    original_phrase = correction.transcript_phrase
    correction_votes = TranscriptPhraseCorrectionVote.objects.filter(
        transcript_phrase_correction=correction
    )
    competing_corrections = TranscriptPhraseCorrection.objects.filter(
        transcript_phrase=original_phrase
    ).exclude(pk=correction.pk)

    author_score, created = Score.objects.get_or_create(
        user=correction.user,
        score=10,
        game=2,
        justification=1,
        correction=correction
    )
    if created:
        score_log.info(
            '{} +10 points for authoring popular correction {}'.format(
                correction.user, correction
            )
        )

    for vote in correction_votes.filter(upvote=True):
        score, created = Score.objects.get_or_create(
            user=vote.user,
            score=10,
            game=3,
            justification=1,
            correction=correction
        )
        if created:
            score_log.info(
                '{} +10 points for contributing to {} confidence'.format(
                    vote.user, correction
                )
            )

    for vote in correction_votes.filter(upvote=False):
        score, created = Score.objects.get_or_create(
            user=vote.user,
            score=-5,
            game=3,
            justification=1,
            correction=correction
        )
        if created:
            score_log.info(
                '{} -5 points for voting against {} confidence'.format(
                    vote.user, correction
                )
            )

    for competitor in competing_corrections:
        score, created = Score.objects.get_or_create(
            user=competitor.user,
            score=-5,
            game=2,
            justification=1,
            correction=correction
        )
        if created:
            score_log.info(
                '{} -5 points for submitting {} against {}'.format(
                    competitor.user, competitor, correction
                )
            )

    for vote in TranscriptPhraseVote.objects.filter(
        transcript_phrase=original_phrase,
        upvote=False
    ):
        score, created = Score.objects.get_or_create(
            user=vote.user,
            score=10,
            game=1,
            justification=1,
            phrase=vote.transcript_phrase,
            correction=correction
        )
        if created:
            score_log.info(
                '{} +10 points for downvoting {}'.format(
                    vote.user, original_phrase
                )
            )

    for vote in TranscriptPhraseVote.objects.filter(
        transcript_phrase=original_phrase,
        upvote=True
    ):
        score, created = Score.objects.get_or_create(
            user=vote.user,
            score=-5,
            game=1,
            justification=1,
            phrase=original_phrase,
            correction=correction
        )
        if created:
            score_log.info(
                '{} -5 points for upvoting {}'.format(
                    vote.user, original_phrase
                )
            )


@db_task()
def correction_confidence_recedes_from_positive_threshold(correction):
    '''
    Triggered when confidence in a correction recedes from the positive
    threshold.

    Revokes points awarded by correction_confidence_exceeds_positive_threshold.
    '''
    Score.objects.filter(
        correction=correction,
        justification=1
    ).delete()
