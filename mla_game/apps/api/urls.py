from django.conf.urls import url, include
from rest_framework import routers

from .views import (TranscriptViewSet, TranscriptPhraseDownvoteViewSet, SourceViewSet,
                    ProfileViewSet)

router = routers.DefaultRouter()
router.register(r'transcript', TranscriptViewSet)
router.register(r'transcriptphrasedownvote', TranscriptPhraseDownvoteViewSet)
router.register(r'source', SourceViewSet)
router.register(r'profile', ProfileViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
