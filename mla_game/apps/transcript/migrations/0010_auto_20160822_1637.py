# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0009_transcriptmetadata_series'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transcriptmetadata',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
    ]
