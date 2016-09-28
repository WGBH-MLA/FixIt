# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import localflavor.us.models
from django.conf import settings


class Migration(migrations.Migration):

    replaces = [('transcript', '0001_initial'), ('transcript', '0002_auto_20160725_1106'), ('transcript', '0003_transcriptmetadata'), ('transcript', '0004_auto_20160809_2036'), ('transcript', '0005_transcript_data_blob_processesed'), ('transcript', '0006_auto_20160815_2040'), ('transcript', '0007_auto_20160816_2101'), ('transcript', '0008_auto_20160816_2105'), ('transcript', '0009_transcriptmetadata_series'), ('transcript', '0010_auto_20160822_1637'), ('transcript', '0011_transcriptmetadata_broadcast_date'), ('transcript', '0012_auto_20160824_1449'), ('transcript', '0013_transcriptphrasedownvote'), ('transcript', '0014_auto_20160923_1941'), ('transcript', '0015_auto_20160923_2039')]

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Transcript',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('id_number', models.IntegerField()),
                ('collection_id', models.IntegerField()),
                ('name', models.TextField()),
                ('url', models.URLField(max_length=1000)),
                ('transcript_data_blob', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptPhrase',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('id_number', models.IntegerField()),
                ('text', models.TextField()),
                ('time_begin', models.DecimalField(decimal_places=2, max_digits=12)),
                ('time_end', models.DecimalField(decimal_places=2, max_digits=12)),
                ('speaker_id', models.IntegerField()),
                ('transcript', models.ForeignKey(to='transcript.Transcript', related_name='transcript_phrase')),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptPhraseCorrection',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('correction', models.CharField(max_length=500, blank=True, null=True)),
                ('no_words', models.BooleanField(default=False)),
                ('confidence', models.FloatField(default=-1.0)),
                ('appearances', models.IntegerField(default=0)),
                ('votes', models.IntegerField(default=0)),
                ('transcript_phrase', models.ForeignKey(to='transcript.TranscriptPhrase', related_name='transcript_phrase_correction')),
            ],
        ),
        migrations.RenameField(
            model_name='transcriptphrase',
            old_name='time_begin',
            new_name='end_time',
        ),
        migrations.RenameField(
            model_name='transcriptphrase',
            old_name='time_end',
            new_name='start_time',
        ),
        migrations.CreateModel(
            name='TranscriptMetadata',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('transcript', models.OneToOneField(to='transcript.Transcript', related_name='metadata')),
                ('description', models.TextField(blank=True, null=True)),
                ('series', models.CharField(max_length=255, blank=True, null=True)),
                ('broadcast_date', models.CharField(max_length=255, blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('topic', models.CharField(max_length=255)),
                ('transcripts', models.ManyToManyField(to='transcript.Transcript')),
            ],
        ),
        migrations.AddField(
            model_name='transcript',
            name='data_blob_processesed',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('source', models.CharField(max_length=255)),
                ('transcripts', models.ManyToManyField(to='transcript.Transcript')),
                ('pbcore_source', models.CharField(max_length=255, null=True)),
                ('state', localflavor.us.models.USStateField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptPhraseDownvote',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('transcript_phrase', models.ForeignKey(to='transcript.TranscriptPhrase')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='transcriptphrase',
            name='transcript',
            field=models.ForeignKey(to='transcript.Transcript', related_name='phrases'),
        ),
    ]
