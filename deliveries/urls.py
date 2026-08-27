from rest_framework.routers import DefaultRouter
from .views import RetailerDeliveryViewSet, DispatcherDeliveryViewSet

router = DefaultRouter()
router.register('deliveries', RetailerDeliveryViewSet, basename='retailer-delivery')
router.register('dispatcher/deliveries', DispatcherDeliveryViewSet, basename='dispatcher-delivery')

urlpatterns = router.urls