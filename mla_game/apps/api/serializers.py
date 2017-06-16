from rest_framework import serializers
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator

from ..transcript.models import (
    Transcript, TranscriptPhrase, TranscriptMetadata,
    TranscriptPhraseDownvote, TranscriptPhraseCorrection,
    TranscriptPhraseCorrectionVote, Source, Topic
)

from ..accounts.models import Profile, Score, Leaderboard

from ..game.models import LoadingScreenData


class TranscriptSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ('source',)


class TranscriptMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptMetadata
        fields = (
            'description', 'series', 'broadcast_date',
            'media_type'
        )


class TranscriptPhraseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptPhrase
        fields = ('pk', 'start_time', 'end_time', 'text')


class TranscriptSerializer(serializers.ModelSerializer):
    phrases = TranscriptPhraseSerializer(
        many=True, read_only=True,
    )
    metadata = TranscriptMetadataSerializer()
    source = TranscriptSourceSerializer(
        many=True, read_only=True,
        source='source_set'
    )

    class Meta:
        model = Transcript
        fields = (
            'name', 'aapb_link', 'phrases', 'metadata', 'media_url', 'pk',
            'source',
        )


class TranscriptStatsSerializer(serializers.ModelSerializer):
    metadata = TranscriptMetadataSerializer()

    class Meta:
        model = Transcript
        fields = ('name', 'aapb_link', 'metadata', 'media_url', 'statistics')


class TranscriptPhraseCorrectionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = TranscriptPhraseCorrection
        fields = (
            'correction',
            'not_an_error',
            'transcript_phrase',
            'user',
        )


class TranscriptPhraseCorrectionVoteSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = TranscriptPhraseCorrectionVote
        fields = ('transcript_phrase_correction', 'user', 'upvote')


class TranscriptPhraseDownvoteSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = TranscriptPhraseDownvote
        fields = ('transcript_phrase', 'user')

    validators = [
        UniqueTogetherValidator(
            queryset=TranscriptPhraseDownvote.objects.all(),
            fields=('user', 'transcript_phrase')
        )
    ]


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ('pk', 'source', 'state')


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('pk', 'topic', 'slug')


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        max_length=50,
        validators=[
            UniqueValidator(queryset=Profile.objects.all())
        ]
    )

    class Meta:
        model = Profile
        fields = ('preferred_stations', 'preferred_topics', 'considered_phrases',
                  'username', 'game_scores', 'pk', 'completed_challenges')
        extra_kwargs = {
            'considered_phrases': {'write_only': True},
            'completed_challenges': {'read_only': True}
        }


class ProfilePatchSerializer(serializers.ModelSerializer):
    completed = serializers.ChoiceField(
        choices=['game_one', 'game_two', 'game_three'],
    )

    class Meta:
        model = Profile
        fields = ('completed_challenges', 'completed',)
        extra_kwargs = {
            'completed': {'write_only': True},
            'completed_challenges': {'read_only': True}
        }


class ProfilePreferenceClearSerializer(serializers.ModelSerializer):
    clear_topics = serializers.BooleanField()
    clear_stations = serializers.BooleanField()

    class Meta:
        model = Profile
        fields = ('clear_topics', 'clear_stations',
                  'preferred_topics', 'preferred_stations')
        extra_kwargs = {
            'clear_topics': {'write_only': True},
            'clear_stations': {'write_only': True},
            'preferred_topics': {'read_only': True},
            'preferred_stations': {'read_only': True},
        }


class ProfileTranscriptSkipSerializer(serializers.ModelSerializer):
    transcript = serializers.IntegerField()

    class Meta:
        model = Profile
        fields = ('transcript',)
        extra_kwargs = {
            'transcript': {'write_only': True}
        }


class ScoreSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Score
        fields = ('user', 'score', 'game')


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = ('leaderboard',)


class LoadingScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoadingScreenData
        fields = ('data',)
