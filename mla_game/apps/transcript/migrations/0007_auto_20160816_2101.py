# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0006_auto_20160815_2040'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transcriptmetadata',
            name='sony_ci_asset',
        ),
        migrations.AddField(
            model_name='transcriptmetadata',
            name='station',
            field=models.CharField(max_length=255, blank=True),
        ),
    ]
