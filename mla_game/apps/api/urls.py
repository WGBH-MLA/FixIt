from django.conf.urls import url

from .views import streaming_source, random_transcript


urlpatterns = [
    url(r'media/([0-9]*)/$', streaming_source),
    url(r'transcript/random/$', random_transcript),
]
