from django.views.generic import TemplateView


class GameView(TemplateView):
    template_name = 'main.html'
