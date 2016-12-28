import logging
import requests
from random import randint

from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db import models
from localflavor.us.models import USStateField

from mla_game.apps.accounts.models import TranscriptPicks, Profile


django_log = logging.getLogger('django')
scraper_log = logging.getLogger('pua_scraper')
error_log = logging.getLogger('pua_errors')


class TranscriptManager(models.Manager):
    def game_one(self, user):
        picks = TranscriptPicks.objects.get(user=user).picks
        if picks['partially_completed_transcripts']:
            to_return = self.filter(pk=picks['partially_completed_transcripts'][0])
            phrases = to_return.first().phrases.unseen(user)
            return (to_return, phrases)

    def random_transcript(self):
        all_transcripts = self.all().defer('transcript_data_blob')
        number_of_transcripts = all_transcripts.count()
        return self.filter(pk__in=[randint(0, number_of_transcripts - 1)])


class Transcript(models.Model):
    id_number = models.IntegerField()
    collection_id = models.IntegerField()
    name = models.TextField()
    asset_name = models.CharField(max_length=255, blank=True)
    url = models.URLField(max_length=1000)
    transcript_data_blob = JSONField()
    data_blob_processed = models.BooleanField(
        default=False
    )
    metadata_processed = models.BooleanField(
        default=False
    )

    objects = TranscriptManager()

    @property
    def aapb_xml(self):
        xml_url = 'http://americanarchive.org/api/{}.xml'.format(
            self.asset_name
        )
        request = requests.get(xml_url)
        if request.status_code == 200:
            return request.text
        else:
            return None

    @property
    def aapb_link(self):
        return 'http://americanarchive.org/catalog/{}'.format(
            self.asset_name
        )

    @property
    def media_url(self):
        media_request = requests.head(
            'http://americanarchive.org/media/{}?part=1'.format(
                self.asset_name
            ),
            headers={'referer': 'http://americanarchive.org/'}
        )
        if media_request.is_redirect:
            return media_request.headers['Location']
        else:
            return None

    def process_transcript_data_blob(self):
        data = self.transcript_data_blob
        if 'audio_files' in data:
            audio_files = data['audio_files']
            for entry in audio_files:
                if 'filename' in entry:
                    self.asset_name = entry['filename']
                if 'transcript' in entry:
                    if entry['transcript']:
                        new_phrases = [
                            TranscriptPhrase(
                                id_number=phrase['id'],
                                start_time=phrase['start_time'],
                                end_time=phrase['end_time'],
                                text=phrase['text'],
                                speaker_id=phrase['speaker_id'],
                                transcript=self
                            )
                            for phrase in entry['transcript']['parts'] if phrase is not None
                        ]
                        TranscriptPhrase.objects.bulk_create(new_phrases)
                self.data_blob_processed = True
                self.save()
        else:
            error_log.info(
                'Transcript {} has a malformed data blob.'.format(self.pk))

    def __str__(self):
        return self.name


class TranscriptPhraseManager(models.Manager):
    use_for_related_fields = True

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

    def unseen(self, user):
        profile = Profile.objects.get(user=user)
        considered_phrases = [phrase.pk for phrase in
                              profile.considered_phrases.all()]
        return self.exclude(pk__in=considered_phrases)


class TranscriptPhrase(models.Model):
    id_number = models.IntegerField()
    text = models.TextField()
    start_time = models.DecimalField(max_digits=12, decimal_places=2)
    end_time = models.DecimalField(max_digits=12, decimal_places=2)
    speaker_id = models.IntegerField()
    transcript = models.ForeignKey(Transcript, related_name='phrases')

    objects = TranscriptPhraseManager()

    class Meta:
        ordering = ['start_time']

    @property
    def downvotes(self):
        return TranscriptPhraseDownvote.objects.get(transcript_phrase=self.pk).count()

    @property
    def total_length(self):
        return self.end_time - self.start_time

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
    user = models.ForeignKey(User, default=None)

    def __str__(self):
        return str(self.transcript_phrase) + '_correction'


class TranscriptMetadata(models.Model):
    transcript = models.OneToOneField(Transcript, related_name='metadata')
    description = models.TextField(blank=True, null=True)
    series = models.CharField(max_length=255, blank=True, null=True)
    broadcast_date = models.CharField(max_length=255, blank=True, null=True)


class Source(models.Model):
    pbcore_source = models.CharField(max_length=255, null=True)
    source = models.CharField(max_length=255)
    state = USStateField(null=True)
    transcripts = models.ManyToManyField(Transcript)

    def __str__(self):
        return self.source


class Topic(models.Model):
    topic = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    transcripts = models.ManyToManyField(Transcript)

    def __str__(self):
        return self.topic


class PopupPage(models.Model):
    page = models.SmallIntegerField()
    content = JSONField()


class PopupCollection(models.Model):
    collection = models.SmallIntegerField()
    content = JSONField()
