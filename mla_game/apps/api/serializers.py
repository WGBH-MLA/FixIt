from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from ..transcript.models import (
    Transcript, TranscriptPhrase, TranscriptMetadata,
    TranscriptPhraseDownvote, TranscriptPhraseCorrection
)


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
        fields = ('name', 'phrases', 'metadata')


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
