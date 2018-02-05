import logging

from django.conf import settings
from django.shortcuts import get_object_or_404

from django_filters import rest_framework as djfilters

from rest_framework import viewsets, generics, filters, mixins
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAdminUser

from ..transcript.models import (
    Transcript, TranscriptPhrase, TranscriptPhraseVote,
    TranscriptPhraseCorrection,
    TranscriptPhraseCorrectionVote,
    Source, Topic,
)
from ..accounts.models import (
    Profile, Score, Leaderboard, ContributionStatistics
)
from ..game.models import LoadingScreenData, Message
from .serializers import (
    TranscriptSerializer,
    TranscriptCreateSerializer,
    TranscriptStatsSerializer,
    TranscriptPhraseDetailSerializer,
    TranscriptPhraseVoteSerializer,
    TranscriptPhraseCorrectionSerializer,
    TranscriptPhraseCorrectionVoteSerializer,
    TranscriptActiveDormantSerializer,
    ProfileSerializer, ProfilePatchSerializer,
    ProfilePreferenceClearSerializer, ProfileTranscriptSkipSerializer,
    SourceSerializer, TopicSerializer,
    ScoreSerializer, LeaderboardSerializer,
    LoadingScreenSerializer, MessageSerializer,
    ContributionStatisticsSerializer,
)
from .permissions import IsOwner, IsOwnerOrStaff, IsOwnerOrReadOnly

django_log = logging.getLogger('django')

phrase_positive_limit = settings.TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT
phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT
correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class TranscriptViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        viewsets.GenericViewSet):
    permission_classes = (AllowAny,)
    queryset = Transcript.objects.all()
    lookup_field = 'asset_name'
    serializer_class = TranscriptSerializer

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
            for transcript in serializer.data:
                for phrase in transcript['phrases']:
                    if phrase['pk'] in phrases or phrase['current_game'] != 1:
                        phrase['user_can_vote'] = False
                    else:
                        phrase['user_can_vote'] = True
        else:
            for transcript in serializer.data:
                for phrase in transcript['phrases']:
                    if phrase['current_game'] == 1:
                        phrase['user_can_vote'] = True
                    else:
                        phrase['user_can_vote'] = False
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

    def perform_update(self, serializer):
        serializer.save()

    @detail_route(
        methods=['patch'],
        serializer_class=TranscriptActiveDormantSerializer,
        permission_classes=(IsAdminUser,)
    )
    def activate_or_deactivate(self, request, asset_name=None, *args, **kwargs):
        self.get_object().activate_or_deactivate_phrases(request.data['active'])
        kwargs['partial'] = True
        return mixins.UpdateModelMixin.update(self, request, *args, **kwargs)


class TranscriptCreateViewset(mixins.CreateModelMixin,
                              viewsets.GenericViewSet):
    permission_classes = (IsAdminUser,)
    queryset = Transcript.objects.all()
    serializer_class = TranscriptCreateSerializer


class TranscriptStatsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transcript.objects.all()
    lookup_field = 'asset_name'
    serializer_class = TranscriptStatsSerializer
    filter_backends = (filters.OrderingFilter,
                       djfilters.DjangoFilterBackend)
    ordering_fields = ('complete', 'in_progress')
    filter_fields = ('complete', 'in_progress')


class TranscriptPhraseFilter(djfilters.FilterSet):
    min_confidence = djfilters.NumberFilter(name='confidence', lookup_expr='gte')
    max_confidence = djfilters.NumberFilter(name='confidence', lookup_expr='lte')
    min_votes = djfilters.NumberFilter(name='num_votes', lookup_expr='gte')
    max_votes = djfilters.NumberFilter(name='num_votes', lookup_expr='lte')

    class Meta:
        model = TranscriptPhrase
        fields = ('confidence', 'num_corrections', 'num_votes')


class TranscriptPhraseDetailViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TranscriptPhrase.objects.all()
    serializer_class = TranscriptPhraseDetailSerializer
    filter_backends = (djfilters.DjangoFilterBackend,)
    filter_class = TranscriptPhraseFilter


class TranscriptPhraseVoteViewSet(mixins.ListModelMixin,
                                  mixins.CreateModelMixin,
                                  viewsets.GenericViewSet):
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = TranscriptPhraseVote.objects.all()
    serializer_class = TranscriptPhraseVoteSerializer


class TranscriptPhraseCorrectionViewSet(mixins.ListModelMixin,
                                        mixins.CreateModelMixin,
                                        viewsets.GenericViewSet):
    def get_queryset(self):
        return TranscriptPhraseCorrection.objects.filter(
            user=self.request.user
        )
    permission_classes = (IsOwnerOrReadOnly,)
    queryset = TranscriptPhraseCorrection.objects.all()
    serializer_class = TranscriptPhraseCorrectionSerializer


class TranscriptPhraseCorrectionVoteViewSet(mixins.ListModelMixin,
                                            mixins.CreateModelMixin,
                                            viewsets.GenericViewSet):
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


class ProfileStatsViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (IsOwnerOrStaff,)
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'username'


class ScoreViewSet(mixins.ListModelMixin,
                   mixins.CreateModelMixin,
                   viewsets.GenericViewSet):
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


class MessageView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_object(self):
        obj = get_object_or_404(Message, active=True)
        return obj


class ContributionStatisticsView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    queryset = ContributionStatistics.objects.all()
    serializer_class = ContributionStatisticsSerializer

    def get_object(self):
        obj = ContributionStatistics.objects.latest('date')
        self.check_object_permissions(self.request, obj)
        return obj
