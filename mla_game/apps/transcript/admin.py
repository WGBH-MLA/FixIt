from django.contrib import admin
from .models import Transcript, TranscriptPhrase, Topic


class TranscriptAdmin(admin.ModelAdmin):
    model = Transcript


class TranscriptPhraseAdmin(admin.ModelAdmin):
    model = TranscriptPhrase


class TopicAdmin(admin.ModelAdmin):
    model = Topic


admin.site.register(Transcript, TranscriptAdmin)
admin.site.register(TranscriptPhrase, TranscriptPhraseAdmin)
admin.site.register(Topic, TopicAdmin)
