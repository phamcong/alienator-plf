from django.conf.urls import include, url

from .views import IndexView, WebMainView

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),

    # for google webmain
    url(r'google4c82de08f55a8973.html',
        WebMainView.as_view(), name='googleWebMain'),
]
