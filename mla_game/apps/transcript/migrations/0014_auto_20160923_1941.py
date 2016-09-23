# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import localflavor.us.models


class Migration(migrations.Migration):

    dependencies = [
        ('transcript', '0013_transcriptphrasedownvote'),
    ]

    operations = [
        migrations.AddField(
            model_name='source',
            name='pbcore_source',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='source',
            name='state',
            field=localflavor.us.models.USStateField(null=True),
        ),
        migrations.AlterField(
            model_name='transcriptmetadata',
            name='transcript',
            field=models.OneToOneField(related_name='metadata', to='transcript.Transcript'),
        ),
        migrations.AlterField(
            model_name='transcriptphrase',
            name='transcript',
            field=models.ForeignKey(related_name='phrases', to='transcript.Transcript'),
        ),
    ]
