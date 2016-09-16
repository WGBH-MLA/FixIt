from django.conf.urls import url, include
from rest_framework import routers

from .views import streaming_source, random_transcript, TranscriptViewSet

router = routers.DefaultRouter()
router.register(r'transcripts', TranscriptViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'media/([0-9]*)/$', streaming_source),
    url(r'transcript/random/$', random_transcript),
]
