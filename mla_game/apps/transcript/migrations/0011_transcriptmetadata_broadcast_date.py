# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0010_auto_20160822_1637'),
    ]

    operations = [
        migrations.AddField(
            model_name='transcriptmetadata',
            name='broadcast_date',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
