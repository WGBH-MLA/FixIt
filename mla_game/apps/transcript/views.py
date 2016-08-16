from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import requires_csrf_token
import requests

from .models import Transcript


@login_required
@requires_csrf_token
def upload_batch(request):
    if request.method == 'GET':
        return render(request, 'batch.html')
    elif request.method == 'POST':
        Transcript.objects.create_transcript(
            request.FILES['transcript'],
            request.FILES['transcript']
        )
        return HttpResponse()


def streaming_source(transcript):
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
