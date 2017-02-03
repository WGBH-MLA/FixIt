import logging
import datetime

from django.contrib.auth.models import User

from huey.contrib.djhuey import crontab, db_periodic_task, db_task

from .models import Profile, TranscriptPicks, Score, Leaderboard
from mla_game.apps.transcript.models import Transcript, TranscriptPhrase

logger = logging.getLogger('django')


@db_task()
def update_partial_or_complete_transcripts(user, pk_set, **kwargs):
    '''
    When a user considers a phrase in game one, the considered phrase is recorded
    and the set of considered phrases is used to determine a list of partially
    and fully completed transcripts.

    If a transcript gets added to the completed transcripts, trigger
    update_transcript_picks so it gets removed from transcripts user will see.

    This task gets triggered whenever Profile.considered_phrases is updated
    '''
    profile = Profile.objects.get(user=user)

    transcript_picks, created = TranscriptPicks.objects.get_or_create(user=user)
    picks = transcript_picks.picks

    partial_transcripts = set([phrase.transcript.pk for phrase in
                               profile.considered_phrases.all()])
    considered_phrases = [phrase.pk for phrase in
                          profile.considered_phrases.all()]

    if 'completed_transcripts' in picks:
        completed_transcripts = picks['completed_transcripts']
    else:
        completed_transcripts = []

    completed_transcripts_original = completed_transcripts[:]

    for transcript in partial_transcripts:
        all_phrases = [phrase.pk for phrase in
                       TranscriptPhrase.objects.filter(transcript=transcript)]
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

    picks['partially_completed_transcripts'] = [transcript for transcript in partial_transcripts
                                                if transcript not in completed_transcripts]
    picks['completed_transcripts'] = completed_transcripts

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
    picks = transcript_picks.picks

    station_transcripts = Transcript.objects.none()
    topic_transcripts = Transcript.objects.none()

    if profile.preferred_stations is not None:
        for station in profile.preferred_stations.all():
            station_transcripts = station_transcripts | station.transcripts.all()

    if profile.preferred_topics:
        for topic in profile.preferred_topics.all():
            topic_transcripts = topic_transcripts | topic.transcripts.all()

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
