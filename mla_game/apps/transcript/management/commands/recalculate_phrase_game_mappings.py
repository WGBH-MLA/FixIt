from django.core.management.base import BaseCommand
from django.conf import settings

from ...models import TranscriptPhraseVote
from ...tasks import assign_current_game

phrase_positive_limit = settings.TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT
phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT
correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT


class Command(BaseCommand):
    help = '''Recalculate game eligiblity for all phrases'''

    def handle(self, *args, **options):
        to_assign = set()
        for vote in TranscriptPhraseVote.objects.all():
            to_assign.add(vote.transcript_phrase)
        for phrase in to_assign:
            assign_current_game(phrase)
