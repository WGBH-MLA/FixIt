import requests
from random import randint
from django.http import JsonResponse

from ..transcript.models import Transcript, TranscriptPhrase


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
    phrases = TranscriptPhrase.objects.filter(transcript=random_transcript)
    to_return = {}
    to_return['transcript'] = random_transcript.id_number
    to_return['phrases'] = [
        {
            'start': phrase.start_time,
            'end': phrase.end_time,
            'text': phrase.text
        }
        for phrase in phrases
    ]
    return JsonResponse(to_return)
