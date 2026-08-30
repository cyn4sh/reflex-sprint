from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = "Creates the three test users (retailer, dispatcher, rider) if they don't already exist."

    def handle(self, *args, **options):
        test_users = [
            {"username": "test_retailer", "role": User.Role.RETAILER},
            {"username": "test_dispatcher", "role": User.Role.DISPATCHER},
            {"username": "test_rider", "role": User.Role.RIDER},
        ]

        for data in test_users:
            username = data["username"]
            if User.objects.filter(username=username).exists():
                self.stdout.write(self.style.WARNING(f"{username} already exists, skipping."))
                continue

            user = User.objects.create_user(
                username=username,
                password="testuser",
                role=data["role"],
            )
            self.stdout.write(self.style.SUCCESS(f"Created {username} (role={user.role})"))