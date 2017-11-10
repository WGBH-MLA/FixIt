from django.conf.urls import include, url
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.views import logout
from rest_framework_swagger.views import get_swagger_view

from mla_game.apps.game.views import GameView


schema_view = get_swagger_view(title='FixIt API')

urlpatterns = [
    url(r'^$', GameView.as_view()),
    url(r'^leaderboard', GameView.as_view()),
    url(r'^settings', GameView.as_view()),
    url(r'^preferences', GameView.as_view()),
    url(r'^gameone', GameView.as_view()),
    url(r'^gametwo', GameView.as_view()),
    url(r'^gamethree', GameView.as_view()),
    url(r'^api/', include('mla_game.apps.api.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^logout/$', logout, name='logout', kwargs={'next_page': '/'}),
    url('', include('social_django.urls', namespace='social')),
    url(r'^markdownx/', include('markdownx.urls')),
]

if settings.DEBUG:
    urlpatterns += [
        url(r'^swagger/', schema_view),
    ]
