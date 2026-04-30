from django.contrib import admin
from .models import FeedbackSubmission, ContactSubmission


@admin.register(FeedbackSubmission)
class FeedbackSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'category', 'rating', 'status', 'created_at')
    list_filter = ('category', 'status')
    search_fields = ('title',)
    list_per_page = 25


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'priority', 'status', 'created_at')
    list_filter = ('priority', 'status')
    search_fields = ('subject',)
    list_per_page = 25

    @admin.action(description='Mark selected as reviewed')
    def mark_as_reviewed(self, request, queryset):
        queryset.update(status='reviewed')

    actions = [mark_as_reviewed]
