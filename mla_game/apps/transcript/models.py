import logging
import requests
import random
from collections import Counter

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db.models.expressions import RawSQL
from django.db import models
from localflavor.us.models import USStateField

from mla_game.apps.accounts.models import TranscriptPicks

phrase_positive_limit = settings.TRANSCRIPT_PHRASE_POSITIVE_CONFIDENCE_LIMIT
phrase_negative_limit = settings.TRANSCRIPT_PHRASE_NEGATIVE_CONFIDENCE_LIMIT
correction_lower_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_LOWER_LIMIT
correction_upper_limit = settings.TRANSCRIPT_PHRASE_CORRECTION_UPPER_LIMIT

django_log = logging.getLogger('django')


class TranscriptManager(models.Manager):
    def game_one(self, user):
        '''
        Returns a transcript based on user's preferences and/or past progress.
        If no suitable transcript is found, returns a random transcript.
        '''
        picks, created = TranscriptPicks.objects.get_or_create(user=user)
        picks = picks.picks
        if created:
            return (self.random_transcript(), False)
        else:
            try:
                transcript = self.defer('transcript_data_blob').filter(
                    pk=picks['partially_completed_transcripts'][0])
                voted_phrases = [vote.transcript_phrase.pk for vote in
                                 TranscriptPhraseVote.objects.filter(user=user)]
                return (transcript, voted_phrases)
            except Exception:
                pass
            try:
                transcript = self.defer('transcript_data_blob').filter(
                    pk=random.choice(picks['ideal_transcripts']))
                return (transcript, False)
            except Exception:
                pass
            try:
                transcript = self.defer('transcript_data_blob').filter(
                    pk=random.choice(picks['acceptable_transcripts']))
                return (transcript, False)
            except Exception:
                pass
            if 'skipped_transcripts' in picks:
                return (self.random_transcript(in_progress=False), False)
        return (self.random_transcript(), False)

    def game_two(self, user):
        '''
        Returns a tuple containing a queryset of Transcript objects and a list
        of phrase PKs to annotate.
        '''
        phrase_qs = TranscriptPhrase.objects.only('pk')
        correction_qs = TranscriptPhraseCorrection.objects.only(
            'transcript_phrase'
        ).prefetch_related(
            models.Prefetch(
                'transcript_phrase', queryset=phrase_qs
            )
        )
        user_corrected = [
            correction.transcript_phrase.pk for correction in
            TranscriptPhraseCorrection.objects.filter(
                user=user
            ).prefetch_related(
                models.Prefetch(
                    'transcript_phrase', queryset=phrase_qs
                )
            )
        ] + [
            vote.transcript_phrase_correction.transcript_phrase.pk for vote in
            TranscriptPhraseCorrectionVote.objects.filter(
                user=user
            ).prefetch_related(
                models.Prefetch(
                    'transcript_phrase_correction', queryset=correction_qs
                )
            )
        ]
        eligible_phrases = TranscriptPhrase.objects.filter(
                confidence__lte=phrase_negative_limit,
                num_corrections__lt=3
            ).exclude(
                pk__in=user_corrected
            ).prefetch_related(
                models.Prefetch(
                    'transcript', queryset=self.defer('transcript_data_blob')
                )
            )

        counter = Counter(
            phrase.transcript for phrase in eligible_phrases
        ).most_common()
        total = 0
        transcripts = []

        for transcript, count in counter:
            transcripts.append(transcript)
            total += count
            if total >= 20:
                break

        game_two_ready_phrases = [
            phrase.pk for phrase in
            eligible_phrases.filter(transcript__in=transcripts)
        ][:20]

        transcripts_to_return = self.defer('transcript_data_blob').filter(
            phrases__in=game_two_ready_phrases).distinct()

        return (transcripts_to_return, game_two_ready_phrases)

    def game_three(self, user):
        '''
        Game three needs to present a transcript with all of the corrections

        Returns a tuple containing a queryset of Transcript objects and a list
        of dicts containing corrections for phrases in the Transcripts
        '''
        transcript_qs = self.only('pk')
        phrase_qs = TranscriptPhrase.objects.prefetch_related(
            models.Prefetch('transcript', queryset=transcript_qs))
        correction_qs = TranscriptPhraseCorrection.objects.prefetch_related(
            models.Prefetch('transcript_phrase', queryset=phrase_qs))
        corrected_phrases = set(
            [phrase.transcript_phrase for phrase in
             correction_qs.all()]
        )
        already_voted_phrases = set(
            [vote.original_phrase for vote in
             TranscriptPhraseCorrectionVote.objects.prefetch_related(
                 'transcript_phrase_correction'
             ).filter(user=user)]
        )

        corrections = []
        associated_transcripts = []

        for phrase in corrected_phrases:
            if phrase in already_voted_phrases:
                pass
            elif phrase.num_corrections >= 2:
                phrase_corrections = TranscriptPhraseCorrection.objects.filter(
                    transcript_phrase=phrase,
                )
                if phrase_corrections.count() >= 2:
                    corrections.append(
                        {phrase.pk: phrase_corrections,
                         'transcript': phrase.transcript.pk}
                    )
                    associated_transcripts.append(phrase.transcript.pk)

        associated_transcripts.sort(
            key=Counter(associated_transcripts).get, reverse=True
        )

        transcripts = self.defer('transcript_data_blob').filter(
            pk__in=associated_transcripts[:20]).distinct()

        corrections = [correction for correction in corrections
                       if correction['transcript']
                       in associated_transcripts[:20]][:20]

        return (transcripts, corrections)

    def random_transcript(self, in_progress=True):
        if in_progress is False:
            transcripts_in_progress = False
        else:
            transcripts_in_progress = [
                transcript.pk for transcript in self.filter(
                    statistics__phrases_close_to_minimum_sample_size_percent__gt=0
                ).only('pk', 'statistics').order_by(
                    RawSQL(
                        'statistics->>%s',
                        ('phrases_close_to_minimum_sample_size_percent',)
                    )
                )
            ]

        if transcripts_in_progress:
            return self.filter(
                pk=transcripts_in_progress[-1]
            )
        return self.filter(
            pk__in=[
                random.choice(
                    [transcript.pk for transcript in self.all().only('pk')]
                )
            ]
        )


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
    statistics = JSONField(default={
        'total_number_of_phrases': 0,
        'phrases_with_votes_percent': 0,
        'phrases_close_to_minimum_sample_size_percent': 0,
        'phrases_not_needing_correction_percent': 0,
        'phrases_needing_correction_percent': 0,
        'phrases_with_corrections_percent': 0,
        'corrections_submitted': 0,
        'corrections_accepted': 0,
        'phrases_ready_for_export': 0,
    })
    complete = models.BooleanField(default=False)
    in_progress = models.BooleanField(default=False)

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
            django_log.info(
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
        considered_phrases = [vote.transcript_phrase.pk for vote in
                              TranscriptPhraseVote.objects.filter(user=user)]
        return self.exclude(pk__in=considered_phrases)



class TranscriptPhrase(models.Model):
    id_number = models.IntegerField()
    text = models.TextField()
    start_time = models.DecimalField(max_digits=12, decimal_places=2)
    end_time = models.DecimalField(max_digits=12, decimal_places=2)
    speaker_id = models.IntegerField()
    transcript = models.ForeignKey(
        Transcript,
        related_name='phrases',
        on_delete=models.CASCADE,
    )

    confidence = models.FloatField(default=0)
    num_corrections = models.SmallIntegerField(default=0)
    num_votes = models.SmallIntegerField(default=0)
    current_game = models.PositiveSmallIntegerField(default=1)

    objects = TranscriptPhraseManager()

    class Meta:
        ordering = ['start_time']

    @property
    def downvotes_count(self):
        return TranscriptPhraseVote.objects.filter(
            transcript_phrase=self.pk,
            upvote=False
        ).count()

    @property
    def upvotes_count(self):
        return TranscriptPhraseVote.objects.filter(
            transcript_phrase=self.pk,
            upvote=True
        ).count()

    @property
    def considered_by_count(self):
        return self.profile_set.all().count()

    @property
    def corrections(self):
        return self.transcript_phrase_correction.all().count()

    @property
    def total_length(self):
        return self.end_time - self.start_time

    @property
    def best_correction(self):
        corrections = TranscriptPhraseCorrection.objects.filter(
            transcript_phrase=self
        ).order_by('-confidence')
        if corrections.count() > 0:
            return corrections.first()
        return None

    def __str__(self):
        return str(self.transcript) + '_phrase_' + str(self.id)


class TranscriptPhraseVote(models.Model):
    transcript_phrase = models.ForeignKey(
        TranscriptPhrase,
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    upvote = models.NullBooleanField()


class TranscriptPhraseCorrection(models.Model):
    correction = models.CharField(max_length=500, blank=True, null=True)
    no_words = models.BooleanField(default=False)
    confidence = models.FloatField(default=0)
    appearances = models.IntegerField(default=0)
    transcript_phrase = models.ForeignKey(
        TranscriptPhrase,
        related_name='transcript_phrase_correction',
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        User,
        default=None,
        on_delete=models.CASCADE,
    )

    @property
    def votes_count(self):
        return TranscriptPhraseCorrectionVote.objects.filter(
            transcript_phrase_correction=self.pk
        ).count()

    def __str__(self):
        return str(self.transcript_phrase) + '_correction'


class TranscriptPhraseCorrectionVote(models.Model):
    transcript_phrase_correction = models.ForeignKey(
        TranscriptPhraseCorrection,
        on_delete=models.CASCADE,
    )
    upvote = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'transcript_phrase_correction')

    @property
    def original_phrase(self):
        return self.transcript_phrase_correction.transcript_phrase


class TranscriptMetadata(models.Model):
    media_types = (
        ('v', 'Video'),
        ('a', 'Audio'),
        ('u', 'Unknown')
    )
    transcript = models.OneToOneField(
        Transcript,
        related_name='metadata',
        on_delete=models.CASCADE,
    )
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
