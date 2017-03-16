from django.views.generic import TemplateView
from django.conf import settings


class GameView(TemplateView):
    template_name = 'main.html'

    def get_context_data(self, **kwargs):
        context = super(GameView, self).get_context_data(**kwargs)
        context['ga_code'] = settings.GA_CODE
        return context
