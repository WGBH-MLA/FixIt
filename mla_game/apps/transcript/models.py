import json
import logging
from random import randint

import requests
from django.contrib.auth.models import User
from django.db import models


logger = logging.getLogger('pua_scraper')


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
        transcript_data_blob = json.dumps(audio_file['transcript'])
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

    def for_user(self, user):
        profile = user.profile
        if profile.preferred_station is not None:
            transcripts_to_return = profile.preferred_station.transcripts.all()
        if profile.preferred_topics:
            for topic in profile.preferred_topics.all():
                transcripts_to_return = transcripts_to_return & topic.transcripts.all()
        all_transcripts = self.all().defer('transcript_data_blob')
        number_of_transcripts = all_transcripts.count()

        if transcripts_to_return.count() < 10:
            list_of_random_transcripts = []
            number_needed = 10 - transcripts_to_return.count()
            while len(list_of_random_transcripts) < number_needed:
                random_transcript = Transcript.objects.all()[randint(0, number_of_transcripts - 1)]
                list_of_random_transcripts.append(random_transcript.pk)
            transcripts_to_return = transcripts_to_return & Transcript.objects.filter(pk__in=list_of_random_transcripts)
        elif transcripts_to_return.count() > 10:
            return transcripts_to_return[0:9]

        return transcripts_to_return


class Transcript(models.Model):
    id_number = models.IntegerField()
    collection_id = models.IntegerField()
    name = models.TextField()
    url = models.URLField(max_length=1000)
    transcript_data_blob = models.TextField()
    data_blob_processesed = models.BooleanField(
        default=False
    )

    objects = TranscriptManager()

    @property
    def asset_name(self):
        return self.name.replace(
                'AA1677L5/cpb-aacip-', 'cpb-aacip_'
            ).replace(
                '.mp3', ''
            )

    @property
    def aapb_xml(self):
        xml_url = 'http://americanarchive.org/api/{}.xml'.format(
            self.asset_name
        )
        print(xml_url)
        return requests.get(xml_url).text

    @property
    def aapb_link(self):
        return 'http://americanarchive.org/catalog/{}'.format(
            self.asset_name
        )

    def process_transcript_data_blob(self):
        new_phrases = [
            TranscriptPhrase(
                id_number=phrase['id'],
                start_time=phrase['start_time'],
                end_time=phrase['end_time'],
                text=phrase['text'],
                speaker_id=phrase['speaker_id'],
                transcript=self
            )
            for phrase in json.loads(
                self.transcript_data_blob
            )['parts']
            if phrase is not None
        ]
        TranscriptPhrase.objects.bulk_create(new_phrases)

    def __str__(self):
        return self.name


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

    @property
    def downvotes(self):
        return TranscriptPhraseDownvote.objects.get(transcript_phrase=self.pk).count()

    def __str__(self):
        return str(self.transcript) + '_phrase_' + str(self.id)


class TranscriptPhraseDownvote(models.Model):
    transcript_phrase = models.ForeignKey(TranscriptPhrase)
    user = models.ForeignKey(User)


class TranscriptPhraseCorrection(models.Model):
    correction = models.CharField(max_length=500, blank=True, null=True)
    no_words = models.BooleanField(default=False)
    confidence = models.FloatField(default=-1.0)
    appearances = models.IntegerField(default=0)
    votes = models.IntegerField(default=0)
    transcript_phrase = models.ForeignKey(TranscriptPhrase, related_name='transcript_phrase_correction')

    def __str__(self):
        return str(self.transcript_phrase) + '_correction'


class TranscriptMetadata(models.Model):
    transcript = models.OneToOneField(Transcript)
    description = models.TextField(blank=True, null=True)
    series = models.CharField(max_length=255, blank=True, null=True)
    broadcast_date = models.CharField(max_length=255, blank=True, null=True)


class Source(models.Model):
    source = models.CharField(max_length=255)
    transcripts = models.ManyToManyField(Transcript)

    def __str__(self):
        return self.source


class Topic(models.Model):
    topic = models.CharField(max_length=255)
    transcripts = models.ManyToManyField(Transcript)

    def __str__(self):
        return self.topic


class Genre(models.Model):
    genre = models.CharField(max_length=255)
    transcripts = models.ManyToManyField(Transcript)
