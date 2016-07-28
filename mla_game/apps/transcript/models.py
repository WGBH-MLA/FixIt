import json
from django.db import models


class TranscriptManager(models.Manager):
    def create_transcript(self, data_blob):
        if data_blob['audio_files'] is None:
            return None
        audio_file = data_blob['audio_files'][0]
        if audio_file['current_status'] != 'Transcript complete':
            return None
        name = data_blob['title']
        id_number = data_blob['id']
        collection_id = data_blob['collection_id']
        url = audio_file['url']
        transcript_data_blob = audio_file['transcript']
        try:
            transcript = Transcript.objects.get(id_number=id_number)
            transcript.transcript_data_blob = transcript_data_blob
        except Transcript.DoesNotExist:
            transcript = self.create(
                name=name,
                id_number=id_number,
                collection_id=collection_id,
                url=url,
                transcript_data_blob=transcript_data_blob
            )
        return transcript


class Transcript(models.Model):
    id_number = models.IntegerField()
    collection_id = models.IntegerField()
    name = models.TextField()
    url = models.URLField(max_length=1000)
    transcript_data_blob = models.TextField()

    objects = TranscriptManager()

    def __unicode__(self):
        return self.name

    def process_transcript_data_blob(self):
        # json_data_blob = json.load(self.transcript_data_blob)
        for phrase in self.transcript_data_blob['parts']:
            transcript_phrase = TranscriptPhrase.objects.create_transcript_phrase(phrase, self)
            if transcript_phrase is None:
                continue
            transcript_phrase.save()


class TranscriptPhraseManager(models.Manager):
    def create_transcript_phrase(self, data_blob, transcript):
        id_number = data_blob['id']
        start_time = data_blob['start_time']
        end_time = data_blob['end_time']
        text = data_blob['text']
        speaker_id = data_blob['speaker_id']
        try:
            transcript_phrase = TranscriptPhrase.objects.get(id_number=id_number)
        except TranscriptPhrase.DoesNotExist:
            transcript_phrase = self.create(
                id_number=id_number,
                text=text,
                start_time=start_time,
                end_time=end_time,
                speaker_id=speaker_id,
                transcript=transcript
            )
        return transcript_phrase


class TranscriptPhrase(models.Model):
    id_number = models.IntegerField()
    text = models.TextField()
    start_time = models.DecimalField(max_digits=12, decimal_places=2)
    end_time = models.DecimalField(max_digits=12, decimal_places=2)
    speaker_id = models.IntegerField()
    transcript = models.ForeignKey(Transcript, related_name='transcript_phrase')

    objects = TranscriptPhraseManager()

    def __unicode__(self):
        return str(self.transcript) + '_phrase_' + str(self.id)


class TranscriptPhraseCorrection(models.Model):
    correction = models.CharField(max_length=500, blank=True, null=True)
    no_words = models.BooleanField(default=False)
    confidence = models.FloatField(default=-1.0)
    appearances = models.IntegerField(default=0)
    votes = models.IntegerField(default=0)
    transcript_phrase = models.ForeignKey(TranscriptPhrase, related_name='transcript_phrase_correction')

    def __unicode__(self):
        return str(self.transcript_phrase) + '_correction'
