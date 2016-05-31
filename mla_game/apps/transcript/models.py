from django.db import models


class TranscriptManager(models.Manager):
    def create_transcript(self, name, original_transcript):
        transcript = self.create(name=name, original_transcript=original_transcript)
        return transcript


class Transcript(models.Model):
    name = models.CharField(max_length=500)
    original_transcript = models.FileField('original_transcripts/')

    objects = TranscriptManager()

    def __unicode__(self):
        return self.name


class TranscriptPhrase(models.Model):
    original_phrase = models.CharField(max_length=500)
    time_begin = models.TimeField()
    time_end = models.TimeField()
    transcript = models.ForeignKey(Transcript, 'transcript_phrase')

    def __unicode__(self):
        return self.transcript + '_phrase'


class TranscriptPhraseCorrection(models.Model):
    correction = models.CharField(max_length=500, blank=True, null=True)
    no_words = models.BooleanField(default=False)
    confidence = models.FloatField(default=-1.0)
    appearances = models.IntegerField(default=0)
    votes = models.IntegerField(default=0)
    transcript_phrase = models.ForeignKey(TranscriptPhrase, 'transcript_phrase_correction')

    def __unicode__(self):
        return self.transcript_phrase + '_correction'
