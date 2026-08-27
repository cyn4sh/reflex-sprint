from django.contrib import admin
from .models import Delivery


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'status', 'retailer', 'rider', 'is_confirmed', 'created_at')
    list_filter = ('status', 'is_confirmed')