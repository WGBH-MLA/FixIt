# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0013_transcriptphrasedownvote'),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='preferred_station',
            field=models.ForeignKey(default=None, to='transcript.Source', blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='preferred_topics',
            field=models.ManyToManyField(to='transcript.Topic'),
        ),
    ]
