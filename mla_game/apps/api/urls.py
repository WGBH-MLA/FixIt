from django.conf.urls import url

from .views import streaming_source


urlpatterns = [
    url(r'media/([0-9]*)/$', streaming_source),
]
