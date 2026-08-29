from rest_framework import serializers
from accounts.models import User


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class CurrentUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "role"]