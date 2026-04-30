from rest_framework import serializers
from .models import FeedbackSubmission, ContactSubmission


class FeedbackSubmissionSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = FeedbackSubmission
        fields = ['id', 'type', 'title', 'message', 'rating', 'category', 'status', 'created_at', 'updated_at']
        read_only_fields = ['status', 'created_at', 'updated_at']

    def get_type(self, obj):
        return 'feedback'

    def create(self, validated_data):
        return FeedbackSubmission.objects.create(
            user=self.context['request'].user,
            **validated_data,
        )


class ContactSubmissionSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = ContactSubmission
        fields = ['id', 'type', 'subject', 'body', 'priority', 'status', 'created_at', 'updated_at']
        read_only_fields = ['status', 'created_at', 'updated_at']

    def get_type(self, obj):
        return 'contact'

    def create(self, validated_data):
        return ContactSubmission.objects.create(
            user=self.context['request'].user,
            **validated_data,
        )
