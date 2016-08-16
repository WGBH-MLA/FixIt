from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import logout

urlpatterns = [
    url(r'', include('mla_game.prototype.urls', namespace='prototype')),
    url(r'^logout/$', logout, name='logout', kwargs={'next_page': '/'}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^transcript/', include('mla_game.apps.transcript.urls')),
    url('', include('social.apps.django_app.urls', namespace='social'))
]
