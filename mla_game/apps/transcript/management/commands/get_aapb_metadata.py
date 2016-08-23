import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand

from ...models import Transcript, TranscriptMetadata, Genre, Topic


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

    def _station(self, root):
        try:
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}creator'):
                return child.text
        except:
            return ''

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
                if child.attrib['titleType'] == 'Series':
                    return child.text
        except:
            return ''

    def _broadcast_date(self, root):
        try:
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreAssetDate'):
                if child.attrib['dateType'] == 'Broadcast':
                    return child.text
        except:
            return ''

    def handle(self, *args, **options):
        for transcript in Transcript.objects.all():
            try:
                tree = ET.ElementTree(ET.fromstringlist(transcript.aapb_xml))
                root = tree.getroot()
                self._genres_and_topics(transcript, root)
                tmd, created = TranscriptMetadata.objects.update_or_create(
                    transcript=transcript,
                    station=self._station(root),
                    description=self._description(root),
                    series=self._series_title(root),
                )
                tmd.save()
            except:
                pass
