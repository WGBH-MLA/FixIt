# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-03 16:29
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0019_remove_transcriptphrasecorrection_not_an_error'),
    ]

    operations = [
        migrations.DeleteModel(
            name='PopupCollection',
        ),
        migrations.DeleteModel(
            name='PopupPage',
        ),
    ]