# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-05 19:00
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0023_auto_20171113_1841'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transcriptphrasecorrection',
            name='appearances',
        ),
        migrations.RemoveField(
            model_name='transcriptphrasecorrection',
            name='no_words',
        ),
    ]
