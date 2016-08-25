import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand

from ...models import Transcript, TranscriptMetadata, Genre, Topic, Source


aapb_url_prefix = 'http://americanarchive.org/api/'


class Command(BaseCommand):
    help = 'Gets the AAPB PBCore information for a given transcript'

    def _genres_and_topics(self, transcript, root):
        genres = []
        topics = []
        for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreGenre'):
            if child.attrib['annotation'] == 'genre':
                genres.append(child.text)
                for genre in set(genres):
                    genre_object, _ = Genre.objects.get_or_create(genre=genre)
                    genre_object.transcripts.add(transcript)
            if child.attrib['annotation'] == 'topic':
                topics.append(child.text)
                for topic in set(topics):
                    topic_object, _ = Topic.objects.get_or_create(topic=topic)
                    topic_object.transcripts.add(transcript)

    def _sources(self, transcript, root):
        source_candidates = []
        useless_sources = [
            'pbcore XML database UUID',
            'Sony Ci',
            'http://americanarchiveinventory.org',
            'unknown',
        ]
        try:
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}creator'):
                source_candidates.append(child.text)
        except:
            pass
        try:
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreIdentifier'):
                if 'source' in child.attrib:
                    source_candidates.append(child.attrib['source'])
        except:
            pass
        for candidate in set(source_candidates):
            if candidate not in useless_sources:
                source, created = Source.objects.get_or_create(source=candidate)
                source.transcripts.add(transcript)

    def _description(self, root):
        try:
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreDescription'):
                if child.attrib['descriptionType'] == 'Description':
                    return child.text
        except:
            return ''

    def _series_title(self, root):
        try:
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreTitle'):
                if child.attrib['titleType'] == 'Series' or child.attrib['titleType'] == 'Program':
                    print(child.text)
                    return child.text
        except:
            return ''

    def _broadcast_date(self, root):
        try:
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreAssetDate'):
                return child.text
        except:
            return ''

    def handle(self, *args, **options):
        for transcript in Transcript.objects.all():
            try:
                tree = ET.ElementTree(ET.fromstringlist(transcript.aapb_xml))
                root = tree.getroot()
                self._genres_and_topics(transcript, root)
                self._sources(transcript, root)
                metadata = {
                    'description': self._description(root),
                    'series': self._series_title(root),
                    'broadcast_date': self._broadcast_date(root),
                }
                tmd, created = TranscriptMetadata.objects.update_or_create(
                    transcript=transcript,
                    defaults=metadata,
                )
                tmd.save()
            except:
                pass
