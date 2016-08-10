# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0002_auto_20160725_1106'),
    ]

    operations = [
        migrations.CreateModel(
            name='TranscriptMetadata',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sony_ci_asset', models.CharField(max_length=255)),
                ('transcript', models.OneToOneField(to='transcript.Transcript')),
            ],
        ),
    ]
