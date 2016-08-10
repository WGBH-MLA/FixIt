import requests
import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand

from ...models import Transcript, TranscriptMetadata, Genre, Topic


aapb_url_prefix = 'http://americanarchive.org/api/'


class Command(BaseCommand):
    help = 'Gets the AAPB PBCore information for a given transcript'

    def handle(self, *args, **options):
        for t in Transcript.objects.all():
            newname = t.name.replace('AA1677L5/cpb-aacip-', 'cpb-aacip_').replace('mp3', 'xml')
            aapb_data = requests.get(aapb_url_prefix + newname)
            tree = ET.ElementTree(ET.fromstringlist(aapb_data.text))
            root = tree.getroot()
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreIdentifier'):
                if child.attrib['source'] == 'Sony Ci':
                    t_sony_ci_asset = child.text
            genres = []
            topics = []
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreGenre'):
                if child.attrib['annotation'] == 'genre':
                    genres.append(child.text)
                    for genre in set(genres):
                        genre_object, _ = Genre.objects.get_or_create(genre=genre)
                        genre_object.transcripts.add(t)
                if child.attrib['annotation'] == 'topic':
                    topics.append(child.text)
                    for topic in set(topics):
                        topic_object, _ = Topic.objects.get_or_create(topic=topic)
                        topic_object.transcripts.add(t)
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreDescription'):
                try:
                    if child.attrib['descriptionType'] == 'Description':
                        t_description = child.text
                except:
                    t_description = ''

            tmd, created = TranscriptMetadata.objects.get_or_create(transcript=t)
            tmd.sony_ci_asset = t_sony_ci_asset
            tmd.description = t_description
            tmd.save()
