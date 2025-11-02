from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConfessionViewSet, PostViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'confessions', ConfessionViewSet, basename='confession')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
