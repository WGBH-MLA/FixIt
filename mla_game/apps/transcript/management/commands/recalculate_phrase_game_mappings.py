from django.core.management.base import BaseCommand
from django.conf import settings

from ...models import (
    TranscriptPhrase, TranscriptPhraseCorrection,
)

phrase_positive_limit = settings.TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT
phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT
correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT


class Command(BaseCommand):
    help = '''Recalculate game eligiblity for all phrases'''

    def handle(self, *args, **options):
        for phrase in TranscriptPhrase.objects.filter(current_game=1).exclude(confidence=0):
            if phrase.confidence >= phrase_positive_limit:
                phrase.current_game = 0
                print('Taking phrase {} with confidence {} out of the game'.format(
                    phrase, phrase.confidence
                ))
            elif phrase.confidence <= phrase_negative_limit:
                phrase.current_game = 2
                print('Putting phrase {} with confidence {} into game two'.format(
                    phrase, phrase.confidence
                ))
            phrase.save()

        for phrase in TranscriptPhrase.objects.filter(current_game=2):
            if TranscriptPhraseCorrection.objects.filter(transcript_phrase=phrase).count() > 0:
                print('Putting phrase {} with into game three'.format(phrase))
                phrase.current_game = 3
                phrase.save()

        for phrase in TranscriptPhrase.objects.filter(current_game=3):
            corrections = TranscriptPhraseCorrection.objects.filter(transcript_phrase=phrase)
            for correction in corrections:
                if correction.confidence > correction_upper_limit:
                    print('Phrase {} with correction {} is good enough to move out of the game'.format(
                        phrase, correction
                    ))
                    phrase.current_game = 0
                    phrase.save()
                    break
