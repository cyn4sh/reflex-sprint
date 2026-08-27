from rest_framework.routers import DefaultRouter
from deliveries.views import RetailerDeliveryViewSet, DispatcherDeliveryViewSet, RiderDeliveryViewSet

router = DefaultRouter()
router.register('deliveries', RetailerDeliveryViewSet, basename='retailer-delivery')
router.register('dispatcher/deliveries', DispatcherDeliveryViewSet, basename='dispatcher-delivery')
router.register('rider/deliveries', RiderDeliveryViewSet, basename='rider-delivery')

urlpatterns = router.urls