from django.conf.urls import include, url
from .views import HomePageView

urlpatterns = [
    url(r'', HomePageView.as_view()),
]
