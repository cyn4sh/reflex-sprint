import uuid
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, MethodNotAllowed
from rest_framework.response import Response
from deliveries.models import Delivery
from deliveries.serializers import (
    DeliveryWriteSerializer, DeliveryReadSerializer,
    DeliveryAssignSerializer, DeliveryStatusOverrideSerializer,
)


class IsRetailer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'retailer'


class IsDispatcher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'dispatcher'


class IsRider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'rider'


class RetailerDeliveryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsRetailer]
    http_method_names = ['get', 'post', 'patch']

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


class DispatcherDeliveryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsDispatcher]
    http_method_names = ['get', 'post']

    def get_queryset(self):
        queryset = Delivery.objects.all()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    def get_serializer_class(self):
        return DeliveryReadSerializer

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST', detail="Dispatchers cannot create deliveries.")

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status == Delivery.Status.DELIVERED:
            raise PermissionDenied("Cannot assign a delivery that has already been delivered.")
        serializer = DeliveryAssignSerializer(delivery, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(status=Delivery.Status.ASSIGNED)
        return Response(DeliveryReadSerializer(delivery).data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        delivery = self.get_object()
        serializer = DeliveryStatusOverrideSerializer(delivery, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(DeliveryReadSerializer(delivery).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status == Delivery.Status.DELIVERED:
            raise PermissionDenied("Cannot cancel a delivery that has already been delivered.")
        delivery.status = Delivery.Status.CANCELLED
        delivery.save()
        return Response(DeliveryReadSerializer(delivery).data)


class RiderDeliveryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsRider]
    http_method_names = ['get', 'post']

    def get_queryset(self):
        return Delivery.objects.filter(rider=self.request.user)

    def get_serializer_class(self):
        return DeliveryReadSerializer

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST', detail="Riders cannot create deliveries.")

    @action(detail=True, methods=['post'])
    def pick_up(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status != Delivery.Status.ASSIGNED:
            raise PermissionDenied("Can only mark as Picked Up from Assigned status.")
        delivery.status = Delivery.Status.PICKED_UP
        delivery.save()
        return Response(DeliveryReadSerializer(delivery).data)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        delivery = self.get_object()
        if delivery.is_confirmed:
            raise PermissionDenied("This delivery has already been confirmed.")
        if delivery.status != Delivery.Status.PICKED_UP:
            raise PermissionDenied("Can only confirm a delivery that has been picked up.")
        delivery.status = Delivery.Status.DELIVERED
        delivery.is_confirmed = True
        delivery.save()
        return Response(DeliveryReadSerializer(delivery).data)