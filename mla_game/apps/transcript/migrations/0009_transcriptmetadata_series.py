# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0008_auto_20160816_2105'),
    ]

    operations = [
        migrations.AddField(
            model_name='transcriptmetadata',
            name='series',
            field=models.CharField(null=True, max_length=255, blank=True),
        ),
    ]
