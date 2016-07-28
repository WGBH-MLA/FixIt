# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Transcript',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
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
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('id_number', models.IntegerField()),
                ('text', models.TextField()),
                ('time_begin', models.DecimalField(max_digits=12, decimal_places=2)),
                ('time_end', models.DecimalField(max_digits=12, decimal_places=2)),
                ('speaker_id', models.IntegerField()),
                ('transcript', models.ForeignKey(related_name='transcript_phrase', to='transcript.Transcript')),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptPhraseCorrection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('correction', models.CharField(max_length=500, null=True, blank=True)),
                ('no_words', models.BooleanField(default=False)),
                ('confidence', models.FloatField(default=-1.0)),
                ('appearances', models.IntegerField(default=0)),
                ('votes', models.IntegerField(default=0)),
                ('transcript_phrase', models.ForeignKey(related_name='transcript_phrase_correction', to='transcript.TranscriptPhrase')),
            ],
        ),
    ]
