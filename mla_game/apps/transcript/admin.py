from django.contrib import admin
from .models import Transcript, TranscriptPhrase


class TranscriptAdmin(admin.ModelAdmin):
    model = Transcript


class TranscriptPhraseAdmin(admin.ModelAdmin):
    model = TranscriptPhrase


admin.site.register(Transcript, TranscriptAdmin)
admin.site.register(TranscriptPhrase, TranscriptPhraseAdmin)