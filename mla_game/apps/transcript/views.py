from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import requires_csrf_token

from .models import Transcript


@login_required
@requires_csrf_token
def upload_batch(request):
    if request.method == 'GET':
        return render(request, 'batch.html')
    elif request.method == 'POST':
        new_transcript = Transcript.objects.create_transcript(request.FILES['transcript'], request.FILES['transcript'])
        return HttpResponse()
