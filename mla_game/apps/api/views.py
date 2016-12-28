import logging

from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from ..transcript.models import (
    Transcript, TranscriptPhraseDownvote, Source, Topic,
    TranscriptPhraseCorrection
)
from ..accounts.models import Profile, Score
from .serializers import (
    TranscriptSerializer,
    TranscriptPhraseSerializer,
    TranscriptPhraseDownvoteSerializer,
    TranscriptPhraseCorrectionSerializer, SourceSerializer,
    ProfileSerializer, TopicSerializer, ScoreSerializer
)

django_log = logging.getLogger('django')


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class TranscriptViewSet(viewsets.ModelViewSet):
    queryset = Transcript.objects.all()
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
            transcripts, many=True, context={'phrases': phrases})
        phrase_serializer = TranscriptPhraseSerializer(phrases, many=True)
        serializer.data[0]['phrases'] = phrase_serializer.data
        return Response(serializer.data)


class TranscriptPhraseDownvoteViewSet(viewsets.ModelViewSet):
    queryset = TranscriptPhraseDownvote.objects.all()
    serializer_class = TranscriptPhraseDownvoteSerializer


class TranscriptPhraseCorrectionViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return TranscriptPhraseCorrection.objects.filter(
            user=self.request.user
        )
    queryset = TranscriptPhraseCorrection.objects.all()
    serializer_class = TranscriptPhraseCorrectionSerializer


class SourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer
    pagination_class = StandardResultsSetPagination


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        if request.data['considered_phrases']:
            for phrase in self.get_object().considered_phrases.all():
                request.data['considered_phrases'].append(phrase.pk)
        return self.update(request, *args, **kwargs)


class ScoreViewSet(viewsets.ModelViewSet):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
