import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from submissions.models import FeedbackSubmission, ContactSubmission

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with demo data (idempotent)'

    def handle(self, *args, **kwargs):
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write('Superuser already exists — skipping seed.')
            return

        admin = User.objects.create_superuser(
            username='admin', email='admin@skillova.dev', password='admin1234'
        )
        self.stdout.write(f'Created superuser: {admin.username}')

        demo_users = []
        for i in range(1, 6):
            user = User.objects.create_user(
                username=f'user{i}', email=f'user{i}@skillova.dev', password='demo1234'
            )
            demo_users.append(user)
            self.stdout.write(f'Created user: {user.username}')

        categories = ['bug', 'feature', 'general']
        priorities = ['low', 'medium', 'high']

        for user in demo_users:
            for _ in range(random.randint(2, 3)):
                if random.random() < 0.5:
                    FeedbackSubmission.objects.create(
                        user=user,
                        title=f'Feedback from {user.username}',
                        message='Demo feedback submission.',
                        rating=random.randint(1, 5),
                        category=random.choice(categories),
                    )
                else:
                    ContactSubmission.objects.create(
                        user=user,
                        subject=f'Contact from {user.username}',
                        body='Demo contact submission.',
                        priority=random.choice(priorities),
                    )

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
