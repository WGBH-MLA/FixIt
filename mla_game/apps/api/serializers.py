from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from ..transcript.models import (
    Transcript, TranscriptPhrase, TranscriptMetadata,
    TranscriptPhraseDownvote, TranscriptPhraseCorrection,
    Source
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
    class Meta:
        model = TranscriptPhraseCorrection
        fields = (
            'correction',
            'transcript_phrase',
        )


class TranscriptPhraseDownvoteSerializer(serializers.ModelSerializer):
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


class ProfileSerializer(serializers.ModelSerializer):
    def get_queryset(self):
        user = self.request.user
        return Profile.objects.get(user=user)

    class Meta:
        model = Profile
        fields = ('preferred_stations', 'preferred_topics', 'considered_phrases')
        extra_kwargs = {'considered_phrases': {'write_only': True}}
