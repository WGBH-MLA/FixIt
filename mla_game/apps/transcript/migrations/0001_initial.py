# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import localflavor.us.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('pbcore_source', models.CharField(max_length=255, null=True)),
                ('source', models.CharField(max_length=255)),
                ('state', localflavor.us.models.USStateField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('topic', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Transcript',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('id_number', models.IntegerField()),
                ('collection_id', models.IntegerField()),
                ('name', models.TextField()),
                ('asset_name', models.CharField(max_length=255, blank=True)),
                ('url', models.URLField(max_length=1000)),
                ('transcript_data_blob', models.TextField()),
                ('data_blob_processed', models.BooleanField(default=False)),
                ('metadata_processed', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptMetadata',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('description', models.TextField(null=True, blank=True)),
                ('series', models.CharField(max_length=255, null=True, blank=True)),
                ('broadcast_date', models.CharField(max_length=255, null=True, blank=True)),
                ('transcript', models.OneToOneField(to='transcript.Transcript', related_name='metadata')),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptPhrase',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('id_number', models.IntegerField()),
                ('text', models.TextField()),
                ('start_time', models.DecimalField(max_digits=12, decimal_places=2)),
                ('end_time', models.DecimalField(max_digits=12, decimal_places=2)),
                ('speaker_id', models.IntegerField()),
                ('transcript', models.ForeignKey(related_name='phrases', to='transcript.Transcript')),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptPhraseCorrection',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('correction', models.CharField(max_length=500, null=True, blank=True)),
                ('no_words', models.BooleanField(default=False)),
                ('confidence', models.FloatField(default=-1.0)),
                ('appearances', models.IntegerField(default=0)),
                ('votes', models.IntegerField(default=0)),
                ('transcript_phrase', models.ForeignKey(related_name='transcript_phrase_correction', to='transcript.TranscriptPhrase')),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptPhraseDownvote',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('transcript_phrase', models.ForeignKey(to='transcript.TranscriptPhrase')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='topic',
            name='transcripts',
            field=models.ManyToManyField(to='transcript.Transcript'),
        ),
        migrations.AddField(
            model_name='source',
            name='transcripts',
            field=models.ManyToManyField(to='transcript.Transcript'),
        ),
    ]
