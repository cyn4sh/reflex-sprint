from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = "Creates a superuser admin account if it doesn't already exist."

    def handle(self, *args, **options):
        username = "admin"
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"{username} already exists, skipping."))
            return

        User.objects.create_superuser(
            username=username,
            password="testadmin",
        )
        self.stdout.write(self.style.SUCCESS(f"Created superuser {username}"))