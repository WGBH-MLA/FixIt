# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0003_transcriptmetadata'),
    ]

    operations = [
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('genre', models.CharField(max_length=255)),
                ('transcripts', models.ManyToManyField(to='transcript.Transcript')),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('topic', models.CharField(max_length=255)),
                ('transcripts', models.ManyToManyField(to='transcript.Transcript')),
            ],
        ),
        migrations.AddField(
            model_name='transcriptmetadata',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
