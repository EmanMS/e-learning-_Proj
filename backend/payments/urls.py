from django.urls import path
from .views import CreateOrderView, CaptureOrderView

urlpatterns = [
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('capture-order/', CaptureOrderView.as_view(), name='capture-order'),
]
