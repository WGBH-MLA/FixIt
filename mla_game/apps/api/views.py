import requests
from django.http import JsonResponse

from ..transcript.models import Transcript


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
