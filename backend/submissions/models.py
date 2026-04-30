from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class BaseSubmission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('closed', 'Closed'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']


class FeedbackSubmission(BaseSubmission):
    CATEGORY_CHOICES = [
        ('bug', 'Bug'),
        ('feature', 'Feature'),
        ('general', 'General'),
    ]
    title = models.CharField(max_length=200)
    message = models.TextField()
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)


class ContactSubmission(BaseSubmission):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    subject = models.CharField(max_length=200)
    body = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
