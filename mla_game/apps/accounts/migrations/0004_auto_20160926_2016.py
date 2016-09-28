# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20160923_2044'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='preferred_station',
            new_name='preferred_stations',
        ),
    ]
