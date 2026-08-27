from rest_framework.routers import DefaultRouter
from deliveries.views import RetailerDeliveryViewSet

router = DefaultRouter()
router.register('deliveries', RetailerDeliveryViewSet, basename='delivery')

urlpatterns = router.urls