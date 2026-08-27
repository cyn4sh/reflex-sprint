from django.conf import settings
from django.db import models


class Delivery(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ASSIGNED = 'assigned', 'Assigned'
        PICKED_UP = 'picked_up', 'Picked Up'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=20)
    customer_address = models.TextField()
    item_description = models.TextField()

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='requests_created')
    rider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_deliveries')

    confirmation_code = models.CharField(max_length=50, unique=True)
    is_confirmed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer_name} - {self.status}"