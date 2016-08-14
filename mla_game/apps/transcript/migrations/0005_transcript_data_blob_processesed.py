# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0004_auto_20160809_2036'),
    ]

    operations = [
        migrations.AddField(
            model_name='transcript',
            name='data_blob_processesed',
            field=models.BooleanField(default=False),
        ),
    ]
