# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0002_auto_20161011_1904'),
        ('accounts', '0004_auto_20160926_2016'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='considered_phrases',
            field=models.ManyToManyField(to='transcript.TranscriptPhrase'),
        ),
    ]
