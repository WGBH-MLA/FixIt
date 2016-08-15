from django.shortcuts import render
from django.views.generic import TemplateView

from mla_game.apps.transcript.models import Transcript, TranscriptPhrase


class HomePageView(TemplateView):
    template_name = 'home.html'


class GameView(TemplateView):
    template_name = 'game.html'

    def get_context_data(self, **kwargs):
        context = super(GameView, self).get_context_data(**kwargs)
        transcript = Transcript.objects.all().first()
        context['transcript'] = transcript
        context['phrases'] = TranscriptPhrase.objects.filter(transcript=transcript)
        return context
