# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0007_auto_20160816_2101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transcriptmetadata',
            name='station',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
