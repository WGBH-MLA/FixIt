from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from ..transcript.models import Transcript, TranscriptPhraseDownvote, TranscriptPhraseCorrection


class TranscriptSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transcript
        fields = ('name',)


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
