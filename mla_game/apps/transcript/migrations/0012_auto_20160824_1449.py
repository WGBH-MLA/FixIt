# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0011_transcriptmetadata_broadcast_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('source', models.CharField(max_length=255)),
                ('transcripts', models.ManyToManyField(to='transcript.Transcript')),
            ],
        ),
        migrations.RemoveField(
            model_name='transcriptmetadata',
            name='station',
        ),
    ]
