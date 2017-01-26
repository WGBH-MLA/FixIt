from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField


class Profile(models.Model):
    user = models.OneToOneField(User)
    username = models.CharField(max_length=50, default='')
    preferred_stations = models.ManyToManyField('transcript.Source')
    preferred_topics = models.ManyToManyField('transcript.Topic')
    considered_phrases = models.ManyToManyField('transcript.TranscriptPhrase')

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

    def __str__(self):
        return self.user.username


class TranscriptPicks(models.Model):
    user = models.OneToOneField(User)
    picks = JSONField(default={})


class Score(models.Model):
    """
    Participation Points (for playing the game):
        User gains 10 points for each segment completed (Paul)
        User gets 1 point for each action completed (error identified, fix supplied, vote) (Paul?)
        User gets 100 point bonus for completing the challenge (Paul?)
        User gets 50 points for continuing to another challenge after completing the first. (Paul?)
    Game Points (for actions taken during the game):
        User gets 10 points for each phrase that is marked as containing an
            error in Game 1 that gets validated as having an error in Game 3. (Jay)
        User gets 10 points for each phrase that a user corrects in Game 2 gets
            validated as the correct fix in Game 3 (Jay)
        User gets 10 points for each vote in Game 3 that is the consensus vote (Jay)
        User loses 5 points for each incorrectly identified error (game 1) (Jay)
        User loses 5 points for each incorrectly supplied fix (game 2) (Jay)
        User loses 5 points for each incorrectly validated vote (game 3) (Jay)
    """
    game_choices = (
        1, 'Identify Errors',
        2, 'Suggest Fixes',
        3, 'Validate Fixes'
    )
    user = models.ForeignKey(User)
    score = models.PositiveSmallIntegerField()
    game = models.CharField(max_length=1)
    date = models.DateField(auto_now_add=True)
