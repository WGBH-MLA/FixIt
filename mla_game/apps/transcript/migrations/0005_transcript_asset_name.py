# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0004_transcript_metadata_processed'),
    ]

    operations = [
        migrations.AddField(
            model_name='transcript',
            name='asset_name',
            field=models.CharField(max_length=255, blank=True),
        ),
    ]
