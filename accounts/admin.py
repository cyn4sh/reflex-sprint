from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = tuple(UserAdmin.list_display) + ('role',)
    fieldsets = tuple(UserAdmin.fieldsets) + (
        ('Role', {'fields': ('role',)}),
    )
    add_fieldsets = tuple(UserAdmin.add_fieldsets) + (
        ('Role', {'fields': ('role',)}),
    )