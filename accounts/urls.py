from django.urls import path
from accounts.views import UserListView, CurrentUserView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/me/', CurrentUserView.as_view(), name='current-user')
]