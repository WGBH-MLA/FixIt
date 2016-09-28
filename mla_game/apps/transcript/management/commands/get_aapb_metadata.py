import logging
import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand

from ...models import Transcript, TranscriptMetadata, Topic, Source

logger = logging.getLogger('django')


class Command(BaseCommand):
    help = 'Gets the AAPB PBCore information for a given transcript'

    def _topics(self, transcript, root):
        topics = []
        # science, politics/public affairs, etc. List to come from Sadie and/or
        # Casey
        for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreGenre'):
            if child.attrib['annotation'] == 'topic':
                topics.append(child.text)
                for topic in set(topics):
                    topic_object, _ = Topic.objects.get_or_create(topic=topic)
                    topic_object.transcripts.add(transcript)

    def _sources(self, transcript, root):
        source_candidates = []
        try:
            for child in root.iter('{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreAnnotation'):
                if child.attrib['annotationType'] == 'organization':
                    logger.info('Found source {} for transcript: {}'.format(
                        child.text, transcript
                    ))
                    source_candidates.append(child.text)
        except:
            pass
        for candidate in set(source_candidates):
            source = Source.objects.get(pbcore_source=candidate)
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
                self._topics(transcript, root)
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
