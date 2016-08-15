from django.conf.urls import include, url
from .views import HomePageView, GameView

app_name = 'prototype'
urlpatterns = [
    url(r'^$', HomePageView.as_view()),
    url(r'^game/$', GameView.as_view(), name='game'),
]
