from django.conf.urls import include, url
from rest_framework.routers import DefaultRouter


from ecocases.views import EcocaseViewSet, UserEcocaseViewSet, CommentViewSet, \
    EcocaseCommentViewSet, UserCommentViewSet


router = DefaultRouter()
router.register(r'ecocases', EcocaseViewSet, base_name='ecocase')
router.register(r'user/(?P<userid>[0-9]+)/ecocases', UserEcocaseViewSet,
                base_name='user-ecocase-list')
router.register(r'user/(?P<userid>[0-9]+)/comments', UserCommentViewSet,
                base_name='user-comment-list')
router.register(r'ecocase/(?P<ecocaseid>[0-9]+)/comments', EcocaseCommentViewSet,
                base_name='ecocase-comment-list')
router.register(r'comments', CommentViewSet, base_name='comment')


urlpatterns = [
    url(r'^', include(router.urls)),
]
