# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0003_topic_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='transcript',
            name='metadata_processed',
            field=models.BooleanField(default=False),
        ),
    ]
