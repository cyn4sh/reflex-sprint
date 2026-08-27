from rest_framework import serializers
from .models import Delivery


class DeliveryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['customer_name', 'customer_phone', 'customer_address', 'item_description']


class DeliveryReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = [
            'id', 'customer_name', 'customer_phone', 'customer_address',
            'item_description', 'status', 'confirmation_code', 'is_confirmed',
            'retailer', 'rider', 'created_at', 'updated_at',
        ]
        read_only_fields = fields


class DeliveryAssignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['rider']


class DeliveryStatusOverrideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['status']