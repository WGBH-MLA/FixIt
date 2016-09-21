from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import logout
from mla_game.apps.game.views import GameView

urlpatterns = [
    url(r'^$', GameView.as_view()), 
    url(r'^about', GameView.as_view()),
    url(r'^api/', include('mla_game.apps.api.urls')),
    url(r'^transcript/', include('mla_game.apps.transcript.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout/$', logout, name='logout', kwargs={'next_page': '/'}),
    url('', include('social.apps.django_app.urls', namespace='social'))
]
