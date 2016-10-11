# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0001_squashed_0015_auto_20160923_2039'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transcript',
            old_name='data_blob_processesed',
            new_name='data_blob_processed',
        ),
    ]
