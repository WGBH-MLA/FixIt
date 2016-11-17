from django.conf.urls import url, include
from rest_framework import routers

from .views import (TranscriptViewSet, TranscriptPhraseDownvoteViewSet, SourceViewSet, TopicViewSet,
                    ProfileViewSet)

router = routers.DefaultRouter()
router.register(r'transcript', TranscriptViewSet)
router.register(r'transcriptphrasedownvote', TranscriptPhraseDownvoteViewSet)
router.register(r'source', SourceViewSet)
router.register(r'topic', TopicViewSet)
router.register(r'profile', ProfileViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
