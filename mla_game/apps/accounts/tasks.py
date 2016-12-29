import logging

from django.db.models.signals import m2m_changed

from huey.contrib.djhuey import db_task

from .models import Profile, TranscriptPicks
from mla_game.apps.transcript.models import Transcript, TranscriptPhrase

logger = logging.getLogger('django')


@db_task()
def update_transcript_picks(user, **kwargs):
    profile = Profile.objects.get(user=user)

    transcript_picks, created = TranscriptPicks.objects.get_or_create(user=user)
    picks = transcript_picks.picks

    station_transcripts = Transcript.objects.none()
    topic_transcripts = Transcript.objects.none()

    if profile.preferred_stations is not None:
        for station in profile.preferred_stations.all():
            station_transcripts = station_transcripts | station.transcripts.all()

    if profile.preferred_topics:
        for topic in profile.preferred_topics.all():
            topic_transcripts = topic_transcripts | topic.transcripts.all()

    partial_transcripts = set([phrase.transcript.pk for phrase in profile.considered_phrases.all()])
    considered_phrases = [phrase.pk for phrase in profile.considered_phrases.all()]
    completed_transcripts = []

    for transcript in partial_transcripts:
        all_phrases = [phrase.pk for phrase in
                       TranscriptPhrase.objects.filter(transcript=transcript)]
        seen = []
        unseen = []
        for phrase in all_phrases:
            if phrase in considered_phrases:
                seen.append(phrase)
            else:
                unseen.append(phrase)

        # percent_complete = len(seen)/len(all_phrases)

        if len(seen) == len(all_phrases):
            completed_transcripts.append(transcript)
        else:
            pass
            # logger.info('transcript {} is {} percent complete'.format(transcript, percent_complete))

    picks['station_transcripts'] = [transcript.pk for transcript in station_transcripts
                                    if transcript.pk not in completed_transcripts]
    picks['topic_transcripts'] = [transcript.pk for transcript in topic_transcripts
                                  if transcript.pk not in completed_transcripts]
    picks['ideal_transcripts'] = list(set(picks['station_transcripts']).intersection(
        set(picks['topic_transcripts'])))
    picks['acceptable_transcripts'] = [t for t in picks['station_transcripts'] + picks['topic_transcripts']
                                       if t not in picks['ideal_transcripts']]
    picks['partially_completed_transcripts'] = [transcript for transcript in partial_transcripts
                                                if transcript not in completed_transcripts]
    picks['completed_transcripts'] = completed_transcripts

    transcript_picks.save()
    logger.info(picks)


# m2m_changed.connect(update_transcript_picks, sender=Profile.preferred_stations.through)
