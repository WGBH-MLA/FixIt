from django.conf.urls import url

urlpatterns = [
    url(r'^upload-batch/', 'mla_game.apps.transcript.views.upload_batch', name='upload-batch')
]