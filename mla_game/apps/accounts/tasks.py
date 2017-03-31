import logging
import datetime

from django.contrib.auth.models import User
from django.db.models import Prefetch

from huey.contrib.djhuey import crontab, db_periodic_task, db_task

from .models import Profile, TranscriptPicks, Score, Leaderboard
from mla_game.apps.transcript.models import (
    Transcript, TranscriptPhrase, TranscriptPhraseCorrection,
    TranscriptPhraseCorrectionVote, TranscriptPhraseDownvote,
)

django_log = logging.getLogger('django')
score_log = logging.getLogger('scores')


@db_task()
def update_partial_or_complete_transcripts(user, pk_set, **kwargs):
    '''
    This task gets triggered whenever Profile.considered_phrases is updated.

    When a user considers a phrase in game one, the considered phrase is recorded
    and the set of considered phrases is used to determine a list of partially
    and fully completed transcripts.

    If a transcript gets added to the completed transcripts, trigger
    update_transcript_picks so it gets removed from transcripts user will see.
    '''
    profile = Profile.objects.get(user=user)

    transcript_picks, created = TranscriptPicks.objects.get_or_create(user=user)
    picks = transcript_picks.picks

    transcript_qs = Transcript.objects.only('pk').distinct()

    partial_transcripts = set(
        [phrase.transcript.pk for phrase in
         profile.considered_phrases.all().prefetch_related(
             Prefetch('transcript', queryset=transcript_qs)
         )]
    )
    considered_phrases = [phrase.pk for phrase in
                          profile.considered_phrases.all()]

    if 'completed_transcripts' in picks:
        completed_transcripts = picks['completed_transcripts']
    else:
        completed_transcripts = []

    completed_transcripts_original = completed_transcripts[:]

    for transcript in partial_transcripts:
        all_phrases = [
            phrase.pk for phrase in
            TranscriptPhrase.objects.filter(transcript=transcript).only('pk')
        ]
        seen = []
        unseen = []
        for phrase in all_phrases:
            if phrase in considered_phrases:
                seen.append(phrase)
            else:
                unseen.append(phrase)

        if len(seen) == len(all_phrases):
            completed_transcripts.append(transcript)
        else:
            pass

    picks['partially_completed_transcripts'] = [
        transcript for transcript in partial_transcripts
        if transcript not in completed_transcripts
    ]
    picks['completed_transcripts'] = completed_transcripts

    transcript_picks.save()

    if picks['completed_transcripts'] != completed_transcripts_original:
        update_transcript_picks(user)


@db_task()
def create_explicit_upvotes_from_implied_upvotes(user, pk_set, **kwargs):
    '''
    When a user declines to downvote a phrase in game one, we infer that if
    presented the same phrase in game two, she would choose 'not an error'.
    Therefore, a 'not an error' correction is equivalent to an upvote for the
    phrase.
    '''
    phrase_qs = TranscriptPhrase.objects.only('pk')
    user_downvotes = TranscriptPhraseDownvote.objects.filter(
        user=user).prefetch_related(
            Prefetch('transcript_phrase', queryset=phrase_qs)
        )
    downvoted_phrases = [
        downvote.transcript_phrase.pk for downvote in user_downvotes
    ]
    upvoted_phrases = [pk for pk in pk_set if pk not in downvoted_phrases]
    for phrase in upvoted_phrases:
        TranscriptPhraseCorrection.objects.get_or_create(
            user=user,
            not_an_error=True,
            transcript_phrase=phrase
        )


@db_task()
def update_transcript_picks(user, **kwargs):
    '''
    When a user updates their preferred topics or stations, we need to create
    lists of 'ideal' (matches both) and 'acceptable' (matches either)
    transcripts.
    '''
    profile = Profile.objects.get(user=user)

    transcript_picks, created = TranscriptPicks.objects.get_or_create(user=user)
    picks = transcript_picks.picks

    station_transcripts = Transcript.objects.none()
    topic_transcripts = Transcript.objects.none()

    if profile.preferred_stations is not None:
        for station in profile.preferred_stations.all():
            station_transcripts = station_transcripts | station.transcripts.all()

    if profile.preferred_topics:
        for topic in profile.preferred_topics.all():
            django_log.info('considering topic {} for {}'.format(topic, user.username))
            topic_transcripts = topic_transcripts | topic.transcripts.all()
            django_log.info(topic_transcripts)

    if 'completed_transcripts' in picks:
        completed_transcripts = picks['completed_transcripts']
    else:
        completed_transcripts = []

    picks['station_transcripts'] = [transcript.pk for transcript in station_transcripts
                                    if transcript.pk not in completed_transcripts]
    picks['topic_transcripts'] = [transcript.pk for transcript in topic_transcripts
                                  if transcript.pk not in completed_transcripts]
    picks['ideal_transcripts'] = list(set(picks['station_transcripts']).intersection(
        set(picks['topic_transcripts'])))
    picks['acceptable_transcripts'] = [t for t in picks['station_transcripts'] + picks['topic_transcripts']
                                       if t not in picks['ideal_transcripts']]

    transcript_picks.save()


@db_periodic_task(crontab(hour='*/2'))
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
            'points': top_score['total_score']
        } for rank, top_score in enumerate(past_month_top_scores, start=1)
    ]

    leaderboard['past_week'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['total_score']
        } for rank, top_score in enumerate(past_week_top_scores, start=1)
    ]

    leaderboard['game_one_all_time'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['total_score']
        } for rank, top_score in enumerate(game_one_all_time_top_scores, start=1)
    ]

    leaderboard['game_two_all_time'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['total_score']
        } for rank, top_score in enumerate(game_two_all_time_top_scores, start=1)
    ]

    leaderboard['game_three_all_time'] = [
        {
            'rank': rank,
            'username': top_score['username'],
            'points': top_score['total_score']
        } for rank, top_score in enumerate(game_three_all_time_top_scores, start=1)
    ]

    Leaderboard.objects.create(leaderboard=leaderboard)


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
    upvoters = [correction.user for correction in
                TranscriptPhraseCorrection.objects.filter(
                    transcript_phrase=phrase,
                    not_an_error=True)
                ]
    downvoters = [downvote.user for downvote in
                  TranscriptPhraseDownvote.objects.filter(phrase=phrase)
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
    upvoters = [correction.user for correction in
                TranscriptPhraseCorrection.objects.filter(
                    transcript_phrase=phrase,
                    not_an_error=True)
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
        transcript_phrase=original_phrase,
        not_an_error=False,
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

    for vote in TranscriptPhraseDownvote.objects.filter(transcript_phrase=original_phrase):
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

    for vote in TranscriptPhraseCorrection.objects.filter(
        transcript_phrase=original_phrase,
        not_an_error=True
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
