# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0002_auto_20161011_1904'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='slug',
            field=models.SlugField(max_length=255, default=''),
            preserve_default=False,
        ),
    ]
