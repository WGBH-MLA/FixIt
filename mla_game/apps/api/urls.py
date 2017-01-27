from django.conf.urls import url, include
from rest_framework import routers

from .views import (
    TranscriptViewSet, TranscriptPhraseDownvoteViewSet,
    TranscriptPhraseCorrectionViewSet, SourceViewSet,
    TranscriptPhraseCorrectionVoteViewSet,
    TopicViewSet, ProfileViewSet, ScoreViewSet,
    LeaderboardView
)

from mla_game.apps.accounts.models import Leaderboard

latest_leaderboard = Leaderboard.objects.latest('date').pk

router = routers.DefaultRouter()
router.register(r'transcript', TranscriptViewSet)
router.register(r'transcriptphrasedownvote', TranscriptPhraseDownvoteViewSet)
router.register(r'transcriptphrasecorrection', TranscriptPhraseCorrectionViewSet)
router.register(r'transcriptphrasecorrectionvote', TranscriptPhraseCorrectionVoteViewSet)
router.register(r'source', SourceViewSet)
router.register(r'topic', TopicViewSet)
router.register(r'profile', ProfileViewSet)
router.register(r'score', ScoreViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^leaderboard/$', LeaderboardView.as_view(), {'pk': latest_leaderboard}),
]
