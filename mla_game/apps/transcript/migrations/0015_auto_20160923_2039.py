# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0014_auto_20160923_1941'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='genre',
            name='transcripts',
        ),
        migrations.DeleteModel(
            name='Genre',
        ),
    ]
