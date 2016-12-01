from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from ..transcript.models import (
    Transcript, TranscriptPhrase, TranscriptMetadata,
    TranscriptPhraseDownvote, TranscriptPhraseCorrection,
    Source, Topic
)

from ..accounts.models import Profile


class TranscriptMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptMetadata
        fields = ('description', 'series', 'broadcast_date')


class TranscriptPhraseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptPhrase
        fields = ('pk', 'start_time', 'end_time', 'text')


class TranscriptSerializer(serializers.ModelSerializer):
    phrases = TranscriptPhraseSerializer(many=True, read_only=True)
    metadata = TranscriptMetadataSerializer()

    class Meta:
        model = Transcript
        fields = ('name', 'aapb_link', 'phrases', 'metadata', 'media_url')


class TranscriptPhraseCorrectionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = TranscriptPhraseCorrection
        fields = (
            'correction',
            'transcript_phrase',
            'user',
        )


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
    class Meta:
        model = Profile
        fields = ('preferred_stations', 'preferred_topics', 'considered_phrases',
                  'username')
        extra_kwargs = {'considered_phrases': {'write_only': True}}
