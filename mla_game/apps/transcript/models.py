import logging
import requests
import random
from random import randint
from collections import Counter

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
        picks, created = TranscriptPicks.objects.get_or_create(user=user)
        picks = picks.picks
        if created:
            return (self.random_transcript(), False)
        elif 'partially_completed_transcripts' in picks:
            transcript = self.filter(pk=picks['partially_completed_transcripts'][0])
            phrases = transcript.first().phrases.unseen(user)
            return (transcript, phrases)
        elif 'ideal_transcripts' in picks:
            return (
                self.filter(pk=random.choice(picks['ideal_transcripts'])),
                False
            )
        elif 'acceptable_transcripts' in picks:
            return (
                self.filter(pk=random.choice(picks['acceptable_transcripts'])),
                False
            )
        else:
            return (self.random_transcript(), False)

    def game_two(self, user):
        '''
        TODO:
        - if there's a transcript with many game two ready phrases, we
        should prefer that transcripts

        - for now we're just going to use any phrase with a downvote,
        in the future we need to use phrases that have been verified as
        incorrect using the considered/downvoted ratio

        Done, but needs testing:
        - we should accept up to three corrections for a phrase before removing
        it from game two
        - users should not see a phrase again after correcting it

        Returns a tuple containing a queryset of Transcript objects and a list
        of phrase PKs to annotate
        '''
        downvoted = set([phrase.transcript_phrase.pk for phrase in
                         TranscriptPhraseDownvote.objects.all()])
        for phrase_pk in downvoted.copy():
            if TranscriptPhrase.objects.get(pk=phrase_pk).corrections >= 3:
                downvoted.remove(phrase_pk)
        user_corrected = [
            correction.transcript_phrase.pk for correction in
            TranscriptPhraseCorrection.objects.filter(user=user)
        ]
        phrases_for_correction = [pk for pk in downvoted
                                  if pk not in user_corrected][:20]
        transcripts_to_return = self.filter(
            phrases__in=phrases_for_correction).distinct()
        return (transcripts_to_return, phrases_for_correction)

    def game_three(self, user):
        '''
        Game three needs to present a transcript with all of the corrections

        TODO: exclude not_an_error corrections (maybe already works)

        Done, but needs testing:
            - if a user has already voted on a set of corrections, they should
            not see it again in future games
            - only display if number of submitted corrections >= 2
            - user should only vote on phrases they have not corrected. possible
            solution - submitting a correction automatically votes for the correction
            - restrict results to 20 phrases

        Returns a tuple containing a queryset of Transcript objects and a list
        of dicts containing corrections for phrases in the Transcripts
        '''
        corrected_phrases = set([phrase.transcript_phrase for phrase in
                                TranscriptPhraseCorrection.objects.all()])
        already_voted_phrases = set([
            vote.original_phrase for vote in
            TranscriptPhraseCorrectionVote.objects.filter(
                user=user
            )
        ])
        corrections = []
        associated_transcripts = []

        for phrase in corrected_phrases:
            if phrase in already_voted_phrases:
                pass
            if phrase.corrections >= 2:
                phrase_corrections = TranscriptPhraseCorrection.objects.filter(
                    transcript_phrase=phrase
                )
                corrections.append(
                    {phrase.pk: phrase_corrections,
                     'transcript': phrase.transcript.pk}
                )
                associated_transcripts.append(phrase.transcript.pk)

        associated_transcripts.sort(
            key=Counter(associated_transcripts).get, reverse=True
        )

        transcripts = self.filter(
            pk__in=associated_transcripts[:20]).distinct()

        corrections = [correction for correction in corrections
                       if correction['transcript']
                       in associated_transcripts[:20]][:20]

        return (transcripts, corrections)

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

    @property
    def corrected_phrases(self):
        corrected_phrases = 0
        for phrase in self.phrases.all():
            if phrase.corrections > 0:
                corrected_phrases += 1

        return corrected_phrases

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
    confidence = models.FloatField(default=0)

    objects = TranscriptPhraseManager()

    class Meta:
        ordering = ['start_time']

    @property
    def downvotes(self):
        return TranscriptPhraseDownvote.objects.get(
            transcript_phrase=self.pk).count()

    @property
    def considered_by_count(self):
        return self.profile_set.all().count()

    @property
    def corrections(self):
        return self.transcript_phrase_correction.filter(not_an_error=False).count()

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
    not_an_error = models.BooleanField(default=False)
    no_words = models.BooleanField(default=False)
    confidence = models.FloatField(default=0)
    appearances = models.IntegerField(default=0)
    transcript_phrase = models.ForeignKey(TranscriptPhrase, related_name='transcript_phrase_correction')
    user = models.ForeignKey(User, default=None)

    @property
    def votes_count(self):
        return TranscriptPhraseCorrectionVote.objects.filter(
            transcript_phrase_correction=self.pk
        ).count()

    def __str__(self):
        return str(self.transcript_phrase) + '_correction'


class TranscriptPhraseCorrectionVote(models.Model):
    transcript_phrase_correction = models.ForeignKey(TranscriptPhraseCorrection)
    user = models.ForeignKey(User)

    @property
    def original_phrase(self):
        return self.transcript_phrase_correction.transcript_phrase


class TranscriptMetadata(models.Model):
    media_types = (
        ('v', 'Video'),
        ('a', 'Audio'),
        ('u', 'Unknown')
    )
    transcript = models.OneToOneField(Transcript, related_name='metadata')
    description = models.TextField(blank=True, null=True)
    series = models.CharField(max_length=255, blank=True, null=True)
    broadcast_date = models.CharField(max_length=255, blank=True, null=True)
    media_type = models.CharField(
        max_length=1,
        choices=media_types,
        default='u'
    )


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
