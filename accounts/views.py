from rest_framework import generics, permissions
from accounts.models import User
from accounts.serializers import UserListSerializer, CurrentUserSerializer


class IsDispatcher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'dispatcher'


class UserListView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsDispatcher]

    def get_queryset(self):
        queryset = User.objects.all()
        role_param = self.request.query_params.get('role')
        if role_param:
            queryset = queryset.filter(role=role_param)
        return queryset


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = CurrentUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user