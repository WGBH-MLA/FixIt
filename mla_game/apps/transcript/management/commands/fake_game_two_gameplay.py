import random

from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from ...models import (
    TranscriptPhrase,
    TranscriptPhraseCorrection
)

phrase_positive_limit = settings.TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT
phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT
correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT


class Command(BaseCommand):
    help = 'Creates random(ish) corrections for 100 phrases.'

    def handle(self, *args, **options):
        users = User.objects.all()
        phrases = TranscriptPhrase.objects.filter(
            confidence__lte=phrase_negative_limit,
            num_corrections__lt=3
        )[:100]
        for phrase in phrases:
            for i in range(3):
                corrected_text = phrase.text
                options = {
                    0: corrected_text.upper(),
                    1: '{} - {}'.format(
                        corrected_text, random.choice(
                            ['ping!', 'boing boing', 'ribbit', 'PLOP']
                        )
                    ),
                    2: corrected_text.title()
                }
                user = random.choice(users)
                TranscriptPhraseCorrection.objects.create(
                    correction=options[i],
                    user=user,
                    transcript_phrase=phrase
                )
                print(
                    'Created correction:\nUser:{}\nCorrection:{}'.format(
                        user, options[i]
                    )
                )
