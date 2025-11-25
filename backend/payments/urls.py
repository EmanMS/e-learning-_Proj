from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreateOrderView, CaptureOrderView, PaymentViewSet

router = DefaultRouter()
router.register(r'history', PaymentViewSet, basename='payment-history')

urlpatterns = [
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('capture-order/', CaptureOrderView.as_view(), name='capture-order'),
    path('', include(router.urls)),
]
