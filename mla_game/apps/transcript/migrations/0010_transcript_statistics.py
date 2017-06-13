# -*- coding: utf-8 -*-
# Generated by Django 1.9.12 on 2017-05-02 19:47
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0009_auto_20170308_1450'),
    ]

    operations = [
        migrations.AddField(
            model_name='transcript',
            name='statistics',
            field=django.contrib.postgres.fields.jsonb.JSONField(default={'corrections_submitted': 0, 'phrases_close_to_minimum_sample_size_percent': 0, 'phrases_needing_correction_percent': 0, 'phrases_not_needing_correction_percent': 0, 'phrases_ready_for_export': 0, 'phrases_with_corrections_percent': 0, 'phrases_with_votes_percent': 0, 'total_number_of_phrases': 0}),
        ),
    ]