from django.core.management.base import BaseCommand
from authentication.models import StaffUser

class Command(BaseCommand):
    help = 'Create the default staff user'

    def handle(self, *args, **options):
        email = 'staff@ngoindia.org'
        password = 'Ngoindia123@'
        
        if not StaffUser.objects.filter(email=email).exists():
            staff_user = StaffUser(email=email)
            staff_user.set_password(password)
            staff_user.save()
            self.stdout.write(self.style.SUCCESS(f'Staff user {email} created successfully'))
        else:
            self.stdout.write(self.style.WARNING(f'Staff user {email} already exists'))