import logging
import sys
import traceback
import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand

from ...models import Transcript, TranscriptMetadata, Topic, Source

logger = logging.getLogger('django')

errors = logging.getLogger('metadata_errors')


class Command(BaseCommand):
    help = 'Gets the AAPB PBCore information for a given transcript'

    def _topics(self, transcript, root):
        topic_tuples = [('science',
                         ['Science',
                          'Technology',
                          'Medicine',
                          'Nature',
                          'Environment',
                          'Energy',
                          'Animals',
                          'Psychology',
                          'Weather',
                          ]),
                        ('society',
                         ['Social Issues',
                          'War and Conflict',
                          'Women',
                          'Race and Ethnicity',
                          'Education',
                          'Employment',
                          'Law Enforcement and Crime',
                          'LGBTQ',
                          'Economics',
                          'Military Forces and Armaments',
                          'Agriculture',
                          'Health',
                          'Transportation',
                          'Parenting',
                          'Business',
                          ]),
                        ('politics',
                         ['Politics and Government',
                          'Global Affairs',
                          ]),
                        ('arts',
                         ['Theater',
                          'Performing Arts',
                          'Music',
                          'Architecture',
                          'Film and Television',
                          'Fine Arts',
                          'Dance',
                          'Humor',
                          ]),
                        ('news',
                         ['News',
                          'Journalism',
                          'Public Affairs',
                          'Local Communities',
                          ]),
                        ('humanities',
                         ['History',
                          'Biography',
                          'Philosophy',
                          'Religion',
                          'Geography',
                          'Literature',
                          ]),
                        ('home',
                         ['Food and Cooking',
                          'Home Improvement',
                          'Gardening',
                          'Consumer Affairs and Advocacy',
                          'Antiques and Collectibles',
                          'Crafts',
                          ])]
        topics = []
        for child in root.iter(
                '{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreGenre'):
            if 'source' in child.attrib:
                if child.attrib['source'] == 'AAPB Topical Genre':
                    topics.append(child.text)

        generalized_topics = []
        for topic in set(topics):
            for t in topic_tuples:
                if topic in t[1]:
                    generalized_topics.append(t[0])

        for topic in set(generalized_topics):
            topic_object = Topic.objects.get(slug=topic)
            topic_object.transcripts.add(transcript)

    def _sources(self, transcript, root):
        source_candidates = []
        try:
            for child in root.iter(
                    '{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreAnnotation'):
                if child.attrib['annotationType'] == 'organization':
                    logger.info('Found source {} for transcript: {}'.format(
                        child.text, transcript
                    ))
                    source_candidates.append(child.text)
        except:
            pass
        for candidate in set(source_candidates):
            try:
                source = Source.objects.get(pbcore_source=candidate)
                source.transcripts.add(transcript)
            except:
                pass

    def _description(self, root):
        try:
            for child in root.iter(
                    '{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreDescription'):
                if child.attrib['descriptionType'] == 'Description':
                    return child.text
        except:
            return ''

    def _series_title(self, root):
        try:
            for child in root.iter(
                    '{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreTitle'):
                if child.attrib['titleType'] == 'Series' or child.attrib[
                        'titleType'] == 'Program':
                    return child.text
        except:
            return ''

    def _broadcast_date(self, root):
        try:
            for child in root.iter(
                    '{http://www.pbcore.org/PBCore/PBCoreNamespace.html}pbcoreAssetDate'):
                return child.text
        except:
            return ''

    def handle(self, *args, **options):
        for transcript in Transcript.objects.filter(metadata_processed=False)[:5000]:
            aapb_data = transcript.aapb_xml
            if aapb_data is not None:
                try:
                    tree = ET.ElementTree(ET.fromstringlist(aapb_data))
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
                    transcript.metadata_processed = True
                    transcript.save()
                except Exception as inst:
                    errors.info('Problem transcript: {}'.format(transcript.name))
                    errors.info(transcript.asset_name)
                    errors.info('http://americanarchive.org/api/{}.xml'.format(transcript.asset_name))
                    errors.info(type(inst))
                    errors.info(inst.args)
                    errors.info(inst)
                    tb = sys.exc_info()[2]
                    errors.info(traceback.print_tb(tb))
                    errors.info('\n')
                    pass
