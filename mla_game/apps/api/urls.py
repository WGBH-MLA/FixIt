from django.conf.urls import url, include
from rest_framework import routers

from .views import TranscriptViewSet, TranscriptPhraseDownvoteViewSet

router = routers.DefaultRouter()
router.register(r'transcript', TranscriptViewSet)
router.register(r'transcriptphrasedownvote', TranscriptPhraseDownvoteViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
