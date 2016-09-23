# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0015_auto_20160923_2039'),
        ('accounts', '0002_auto_20160919_2036'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='preferred_station',
        ),
        migrations.AddField(
            model_name='profile',
            name='preferred_station',
            field=models.ManyToManyField(to='transcript.Source'),
        ),
    ]
