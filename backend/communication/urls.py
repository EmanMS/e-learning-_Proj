from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiscussionViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'discussions', DiscussionViewSet, basename='discussion')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
