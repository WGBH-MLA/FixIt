from rest_framework import serializers

from ..transcript.models import Transcript


class TranscriptSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transcript
        fields = ('name', 'url', 'aapb_xml')
