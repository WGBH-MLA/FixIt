# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transcriptphrase',
            old_name='time_begin',
            new_name='end_time',
        ),
        migrations.RenameField(
            model_name='transcriptphrase',
            old_name='time_end',
            new_name='start_time',
        ),
    ]
