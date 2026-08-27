import uuid

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Delivery
from .serializers import DeliveryWriteSerializer, DeliveryReadSerializer


class IsRetailer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'retailer'


class RetailerDeliveryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsRetailer]
    http_method_names = ['get', 'post', 'patch']  # no PUT, no DELETE — matches "no persona can delete"

    def get_queryset(self):
        return Delivery.objects.filter(retailer=self.request.user)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DeliveryWriteSerializer
        return DeliveryReadSerializer

    def perform_create(self, serializer):
        serializer.save(retailer=self.request.user, confirmation_code=str(uuid.uuid4()))

    def perform_update(self, serializer):
        if serializer.instance.status != Delivery.Status.PENDING:
            raise PermissionDenied("Cannot edit a request after it has been assigned.")
        serializer.save()

    def perform_destroy(self, instance):
        raise PermissionDenied("Deliveries cannot be deleted — cancel instead.")

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status != Delivery.Status.PENDING:
            raise PermissionDenied("Cannot cancel a request after it has been assigned.")
        delivery.status = Delivery.Status.CANCELLED
        delivery.save()
        return Response(DeliveryReadSerializer(delivery).data)