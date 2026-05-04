from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from submissions.models import FeedbackSubmission, ContactSubmission
from .custom_metrics import (
    submissions_created_total,
    users_registered_total,
    registered_users_count,
)


@receiver(post_save, sender=FeedbackSubmission)
def on_feedback_created(sender, instance, created, **kwargs):
    if created:
        submissions_created_total.labels(type='feedback').inc()


@receiver(post_save, sender=ContactSubmission)
def on_contact_created(sender, instance, created, **kwargs):
    if created:
        submissions_created_total.labels(type='contact').inc()


@receiver(post_save, sender=get_user_model())
def on_user_created(sender, instance, created, **kwargs):
    if created:
        users_registered_total.inc()
        registered_users_count.inc()
