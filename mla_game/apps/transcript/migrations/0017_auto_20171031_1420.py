# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-10-31 14:20
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0016_auto_20171027_1844'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transcriptphrasedownvote',
            name='transcript_phrase',
        ),
        migrations.RemoveField(
            model_name='transcriptphrasedownvote',
            name='user',
        ),
        migrations.DeleteModel(
            name='TranscriptPhraseDownvote',
        ),
    ]