from datetime import time

from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import Transcript, TranscriptPhrase


class TranscriptTestCase(TestCase):
    def setUp(self):
        fake_file = SimpleUploadedFile(
            'not-really-a-file.txt',
            'this is what\'s in the file that isn\'t a file'.encode()
        )
        Transcript.objects.create(
            name='test transcript',
            original_transcript=fake_file
        )

    def test_transcript_file(self):
        fake = Transcript.objects.get(name='test transcript')
        self.assertEqual(
            fake.name,
            'test transcript'
        )
        self.assertEqual(
            fake.original_transcript.name,
            'original_transcripts/not-really-a-file.txt',
        )
        self.assertEqual(
            fake.original_transcript.read(),
            'this is what\'s in the file that isn\'t a file'.encode()
        )

    def tearDown(self):
        fake = Transcript.objects.get(name='test transcript')
        fake.original_transcript.delete(False)


class TranscriptPhraseTestCase(TestCase):
    def setUp(self):
        fake_file = SimpleUploadedFile(
            'not-really-a-file2.txt',
            'this is what\'s in the file that isn\'t a file'.encode()
        )
        Transcript.objects.create(
            name='test transcript',
            original_transcript=fake_file
        )
        TranscriptPhrase.objects.create(
            original_phrase='old and wrong',
            time_begin=time(0, 1, 0),
            time_end=time(0, 2, 10),
            transcript=Transcript.objects.get(
                name='test transcript'
            )
        )

    def test_transcript_phrase(self):
        fake_transcript = Transcript.objects.get(name='test transcript')
        fake_phrase = TranscriptPhrase.objects.get(
            original_phrase='old and wrong'
        )
        self.assertEqual(
            fake_phrase.original_phrase,
            'old and wrong'
        )
        self.assertEqual(
            fake_phrase.time_begin,
            time(0, 1, 0)
        )
        self.assertEqual(
            fake_phrase.time_end,
            time(0, 2, 10)
        )
        self.assertEqual(
            fake_phrase.transcript,
            fake_transcript
        )

    def tearDown(self):
        fake = Transcript.objects.get(name='test transcript')
        fake.original_transcript.delete(False)
