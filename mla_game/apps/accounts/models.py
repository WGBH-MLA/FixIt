from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField

import logging
django_log = logging.getLogger('django')


class Profile(models.Model):
    '''
    Extends the Django-provided User model.
    Stores the users preferred topics and stations, and which phrases they've
    seen in game one.
    '''
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=50, default='')
    preferred_stations = models.ManyToManyField('transcript.Source')
    preferred_topics = models.ManyToManyField('transcript.Topic')
    completed_challenges = JSONField(
        default={
            'game_one': 0,
            'game_two': 0,
            'game_three': 0,
        }
    )

    @property
    def game_scores(self):
        game_one_total = 0
        game_two_total = 0
        game_three_total = 0
        all_scores = Score.objects.filter(user=self.user)
        game_one_scores = all_scores.filter(game=1)
        game_two_scores = all_scores.filter(game=2)
        game_three_scores = all_scores.filter(game=3)

        for score in game_one_scores:
            game_one_total += score.score

        for score in game_two_scores:
            game_two_total += score.score

        for score in game_three_scores:
            game_three_total += score.score

        total_score = game_one_total + game_two_total + game_three_total

        return {
            'total_score': total_score,
            'game_one_score': game_one_total,
            'game_two_score': game_two_total,
            'game_three_score': game_three_total,
        }

    def update_completed(self, game):
        self.completed_challenges[game] += 1
        self.save()

    def clear_preferences(self, data):
        if 'clear_topics' in data:
            if data['clear_topics']:
                self.preferred_topics.clear()
        if 'clear_stations' in data:
            if data['clear_stations']:
                self.preferred_stations.clear()

    def skip_transcript(self, data):
        if 'transcript' in data:
            transcript_picks, created = TranscriptPicks.objects.get_or_create(
                user=self.user
            )
            picks = transcript_picks.picks
            if 'skipped_transcripts' not in picks:
                picks['skipped_transcripts'] = []
            if 'partially_completed_transcripts' not in picks:
                picks['partially_completed_transcripts'] = []
            if data['transcript'] in picks['partially_completed_transcripts']:
                picks['partially_completed_transcripts'].remove(data['transcript'])
            picks['skipped_transcripts'].append(data['transcript'])
            try:
                picks['ideal_transcripts'].remove(data['transcript'])
            except:
                pass
            try:
                picks['acceptable_transcripts'].remove(data['transcript'])
            except:
                pass
            transcript_picks.save()

    def __str__(self):
        return self.username


class TranscriptPicks(models.Model):
    '''
    This is the data that drives narrowing down the transcripts a user might see
    in game one.

    Roughly, 'picks' is a dict containing:
    'station_transcripts': list of suitable transcripts based on station prefs
    'topic_transcripts': list of suitable transcripts based on topic prefs
    'ideal_transcripts': intersection of above two
    'acceptable_transcripts': symmetric difference of station/topic transcripts
    'partially_completed_transcripts': list of partially complete transcripts
    'completed_transcripts': list of complete transcripts
    'skipped_transcripts': list of transcripts user has chosen to skip
    'auto_skipped_transcripts': list of transcripts skipped when prefs change
    '''
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picks = JSONField(default={})


class Score(models.Model):
    """
    The model for storing points. Points can be awarded by the front end for
    participating in the game('Participation Points', justification=0), or by
    the back end when confidence is calculated based on user input ('Game
    Points', justification!=0).

    Participation Points can't be revoked, but Game Points can be. The phrase
    and correction foreign keys, along with the game and justification, are used
    to associate Scores with actions taken on phrases and corrections so they
    can be revoked as needed.

    Participation Points (for playing the game):
        User gains 10 points for each segment completed
        User gets 1 point for each action completed (error identified, fix supplied, vote)
        User gets 100 point bonus for completing the challenge
        User gets 50 points for continuing to another challenge after completing the first.
    Game Points (for actions taken during the game):
        User gets 10 points for each phrase that is marked as containing an
            error in Game 1 that gets validated as having an error in Game 3.
        User gets 10 points for each phrase that a user corrects in Game 2 gets
            validated as the correct fix in Game 3
        User gets 10 points for each vote in Game 3 that is the consensus vote
        User loses 5 points for each incorrectly identified error (game 1)
        User loses 5 points for each incorrectly supplied fix (game 2)
        User loses 5 points for each incorrectly validated vote (game 3)
    """
    game_choices = (
        (1, 'Identify Errors'),
        (2, 'Suggest Fixes'),
        (3, 'Validate Fixes'),
    )
    justification_choices = (
        (0, 'participation'),
        (1, 'correction confidence exceeds positive threshold'),
        (2, 'phrase confidence exceeds negative threshold'),
        (3, 'phrase confidence exceeds positive threshold'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.SmallIntegerField()
    game = models.CharField(max_length=1, choices=game_choices)
    justification = models.CharField(
        max_length=1,
        choices=justification_choices,
        default=0
    )
    date = models.DateField(auto_now_add=True)
    correction = models.ForeignKey(
        'transcript.TranscriptPhraseCorrection',
        null=True,
        on_delete=models.CASCADE,
    )
    phrase = models.ForeignKey(
        'transcript.TranscriptPhrase',
        null=True,
        on_delete=models.CASCADE,
    )


class Leaderboard(models.Model):
    """
    A simple model to store the result of
    mla_game.apps.accounts.tasks.update_leaderboard, because it's resource
    intensive.
    """
    date = models.DateTimeField(auto_now_add=True)
    leaderboard = JSONField()


class ContributionStatistics(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    statistics = JSONField()
