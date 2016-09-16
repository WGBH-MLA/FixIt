import requests
from random import randint
from django.http import JsonResponse
from rest_framework import viewsets

from ..transcript.models import Transcript, TranscriptPhrase, TranscriptPhraseDownvote, TranscriptMetadata, Source
from .serializers import TranscriptSerializer, TranscriptPhraseDownvoteSerializer


def streaming_source(request, transcript_id):
    transcript = Transcript.objects.get(id_number=transcript_id)
    media_request = requests.head(
        'http://americanarchive.org/media/{}?part=1'.format(
            transcript.asset_name
        ),
        headers={'referer': 'http://americanarchive.org/'}
    )
    if media_request.is_redirect:
        return JsonResponse(
            {'media': media_request.headers['Location']}
        )
    else:
        return None


def random_transcript(request):
    number_of_transcripts = Transcript.objects.count()
    random_transcript = Transcript.objects.all()[randint(0, number_of_transcripts - 1)]
    source = getattr(
        random_transcript,
        'source_set.all().first().source',
        'Unknown'
    )
    transcript_metadata = TranscriptMetadata.objects.get(
        transcript=random_transcript.pk
    )
    phrases = TranscriptPhrase.objects.filter(
        transcript=random_transcript
    ).order_by('start_time')
    to_return = {}
    to_return['transcript'] = random_transcript.id_number
    to_return['series'] = transcript_metadata.series
    to_return['station'] = source
    to_return['phrases'] = [
        {
            'start': phrase.start_time,
            'end': phrase.end_time,
            'text': phrase.text
        }
        for phrase in phrases
    ]
    return JsonResponse(to_return)


class TranscriptViewSet(viewsets.ModelViewSet):
    queryset = Transcript.objects.all()
    serializer_class = TranscriptSerializer


class TranscriptPhraseDownvoteViewSet(viewsets.ModelViewSet):
    queryset = TranscriptPhraseDownvote.objects.all()
    serializer_class = TranscriptPhraseDownvoteSerializer
