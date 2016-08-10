from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'mla_game.apps.accounts'

    def ready(self):
        import mla_game.apps.accounts.signals
