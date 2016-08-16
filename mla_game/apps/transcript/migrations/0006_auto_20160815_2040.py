# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0005_transcript_data_blob_processesed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transcriptmetadata',
            name='sony_ci_asset',
            field=models.TextField(blank=True),
        ),
    ]
