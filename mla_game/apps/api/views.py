import logging

from django.conf import settings

from rest_framework import viewsets, generics
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny

from ..transcript.models import (
    Transcript, TranscriptPhraseDownvote, Source, Topic,
    TranscriptPhraseCorrection,
    TranscriptPhraseCorrectionVote
)
from ..accounts.models import Profile, Score, Leaderboard
from ..game.models import LoadingScreenData
from .serializers import (
    TranscriptSerializer,
    TranscriptStatsSerializer,
    TranscriptPhraseSerializer,
    TranscriptPhraseDownvoteSerializer,
    TranscriptPhraseCorrectionSerializer,
    TranscriptPhraseCorrectionVoteSerializer,
    ProfileSerializer, ProfilePatchSerializer,
    ProfilePreferenceClearSerializer, ProfileTranscriptSkipSerializer,
    SourceSerializer, TopicSerializer,
    ScoreSerializer, LeaderboardSerializer,
    LoadingScreenSerializer
)
from .permissions import IsOwner, IsOwnerOrReadOnly

django_log = logging.getLogger('django')

phrase_positive_limit = settings.TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT
phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT
correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class TranscriptViewSet(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Transcript.objects.all()
    lookup_field = 'asset_name'
    serializer_class = TranscriptSerializer

    @list_route()
    def user_transcripts(self, request):
        transcripts = Transcript.objects.for_user(
            request.user
        )
        serializer = self.get_serializer(transcripts, many=True)
        return Response(serializer.data)

    @list_route()
    def random(self, request):
        transcript = Transcript.objects.random_transcript()
        serializer = self.get_serializer(transcript, many=True)
        return Response(serializer.data)

    @list_route()
    def game_one(self, request):
        transcripts, phrases = Transcript.objects.game_one(request.user)
        serializer = self.get_serializer(
            transcripts, many=True,
        )
        if phrases:
            phrase_serializer = TranscriptPhraseSerializer(phrases, many=True)
            serializer.data[0]['phrases'] = phrase_serializer.data
        return Response(serializer.data)

    @list_route()
    def game_two(self, request):
        transcripts, phrases_for_correction = Transcript.objects.game_two(
            request.user
        )
        serializer = self.get_serializer(
            transcripts, many=True,
        )
        for transcript in serializer.data:
            for phrase in transcript['phrases']:
                if phrase['pk'] in phrases_for_correction:
                    phrase['needs_correction'] = True
                else:
                    phrase['needs_correction'] = False
        return Response(serializer.data)

    @list_route()
    def game_three(self, request):
        transcripts, corrected_phrases = Transcript.objects.game_three(
            request.user
        )
        serializer = self.get_serializer(
            transcripts, many=True
        )
        for transcript in serializer.data:
            for phrase in transcript['phrases']:
                for correction in corrected_phrases:
                    if phrase['pk'] in correction:
                        phrase['corrections'] = [
                            {
                                'pk': correction.pk,
                                'corrected_text': correction.correction
                            } for correction in correction[phrase['pk']]
                        ]
                        correction[phrase['pk']]

        return Response(serializer.data)

    @detail_route(methods=['get'])
    def corrected(self, request, pk=None, asset_name=None):
        '''Returns a corrected transcript'''
        transcript = self.get_object()
        highest_rated_corrections = []
        for phrase in transcript.phrases.all():
            if phrase.confidence >= phrase_positive_limit:
                pass
            else:
                corrections = TranscriptPhraseCorrection.objects.filter(
                    transcript_phrase=phrase,
                    confidence__gte=correction_lower_limit
                ).order_by('-confidence')
                if corrections.count() > 0:
                    highest_rated_corrections.append(corrections.first())
        serializer = self.get_serializer(transcript)
        for correction in highest_rated_corrections:
            for phrase in serializer.data['phrases']:
                if phrase['pk'] == correction.transcript_phrase.pk:
                    phrase['text'] = correction.correction
        return Response(serializer.data)


class TranscriptStatsViewSet(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Transcript.objects.all()
    lookup_field = 'asset_name'
    serializer_class = TranscriptStatsSerializer


class TranscriptPhraseDownvoteViewSet(viewsets.ModelViewSet):
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = TranscriptPhraseDownvote.objects.all()
    serializer_class = TranscriptPhraseDownvoteSerializer


class TranscriptPhraseCorrectionViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return TranscriptPhraseCorrection.objects.filter(
            user=self.request.user
        )
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = TranscriptPhraseCorrection.objects.all()
    serializer_class = TranscriptPhraseCorrectionSerializer


class TranscriptPhraseCorrectionVoteViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return TranscriptPhraseCorrectionVote.objects.filter(
            user=self.request.user
        )
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = TranscriptPhraseCorrectionVote.objects.all()
    serializer_class = TranscriptPhraseCorrectionVoteSerializer


class SourceViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Source.objects.all()
    serializer_class = SourceSerializer
    pagination_class = StandardResultsSetPagination


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = (IsOwner,)
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    @detail_route(methods=['patch'], serializer_class=ProfilePatchSerializer)
    def completed(self, request, *args, **kwargs):
        self.get_object().update_completed(request.data['completed'])
        return self.update(request, *args, **kwargs)

    @detail_route(methods=['patch'], serializer_class=ProfilePreferenceClearSerializer)
    def clear_preferences(self, request, *args, **kwargs):
        self.get_object().clear_preferences(request.data)
        return self.update(request, *args, **kwargs)

    @detail_route(methods=['patch'], serializer_class=ProfileTranscriptSkipSerializer)
    def skip_transcript(self, request, *args, **kwargs):
        self.get_object().skip_transcript(request.data)
        return self.update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        if 'considered_phrases' in request.data:
            request.data['considered_phrases'] += [
                phrase.pk for phrase in
                self.get_object().considered_phrases.all()
            ]
        return self.update(request, *args, **kwargs)


class ScoreViewSet(viewsets.ModelViewSet):
    permission_classes = (IsOwner,)
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer


class LeaderboardView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer

    def get_object(self):
        obj = Leaderboard.objects.latest('date')
        self.check_object_permissions(self.request, obj)
        return obj


class LoadingScreenView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    queryset = LoadingScreenData.objects.all()
    serializer_class = LoadingScreenSerializer

    def get_object(self):
        obj = LoadingScreenData.objects.latest('date')
        self.check_object_permissions(self.request, obj)
        return obj
