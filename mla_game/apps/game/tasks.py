from django.conf import settings

from huey.contrib.djhuey import db_periodic_task
from huey import crontab

from .models import LoadingScreenData
from mla_game.apps.accounts.models import Profile
from mla_game.apps.transcript.models import (
    Transcript, TranscriptPhrase, TranscriptPhraseCorrection,
)

phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT


@db_periodic_task(crontab(hour='*', minute='0'))
def update_loading_screen_data():
    data = {}
    data['total_fixed'] = Transcript.objects.filter(
        statistics__percent_complete=100
    ).count()

    data['transcripts_in_progress'] = Transcript.objects.filter(
        statistics__phrases_with_votes_percent__gt=0
    ).exclude(
        statistics__percent_complete=100
    ).count()

    data['total_number_of_transcripts'] = Transcript.objects.all().count()

    data['total_number_of_players'] = Profile.objects.all().count()

    data['phrases_with_errors'] = TranscriptPhrase.objects.filter(
        confidence__lte=phrase_negative_limit
    ).count()

    data['suggested_corrections'] = TranscriptPhraseCorrection.objects.filter(
        not_an_error=False,
    ).count()

    data['validated_corrections'] = TranscriptPhraseCorrection.objects.filter(
        confidence__gte=correction_upper_limit
    ).count()

    LoadingScreenData.objects.create(data=data)
