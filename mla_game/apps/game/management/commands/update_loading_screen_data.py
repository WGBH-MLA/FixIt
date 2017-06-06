from django.core.management.base import BaseCommand
from mla_game.apps.game.tasks import update_loading_screen_data


class Command(BaseCommand):
    help = '''Update the loading screen data'''

    def handle(self, *args, **options):
        update_loading_screen_data()
