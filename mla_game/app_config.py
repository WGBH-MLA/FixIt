from django.apps import AppConfig


class TranscriptAppConfig(AppConfig):
    name = 'mla_game.apps.transcript'

    def ready(self):
        import mla_game.apps.transcript.signals
