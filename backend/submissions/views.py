from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FeedbackSubmission, ContactSubmission
from .serializers import FeedbackSubmissionSerializer, ContactSubmissionSerializer


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSubmissionSerializer
    permission_classes = [IsAuthenticated]


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactSubmissionSerializer
    permission_classes = [IsAuthenticated]


class MySubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        feedback_qs = FeedbackSubmission.objects.filter(user=request.user)
        contact_qs = ContactSubmission.objects.filter(user=request.user)

        feedback_data = FeedbackSubmissionSerializer(feedback_qs, many=True).data
        contact_data = ContactSubmissionSerializer(contact_qs, many=True).data

        combined = sorted(
            list(feedback_data) + list(contact_data),
            key=lambda x: x['created_at'],
            reverse=True,
        )

        page = int(request.query_params.get('page', 1))
        page_size = 10
        start = (page - 1) * page_size
        paginated = combined[start: start + page_size]

        return Response({'count': len(combined), 'results': paginated})


class MySubmissionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            sub = FeedbackSubmission.objects.get(pk=pk, user=request.user)
            return Response(FeedbackSubmissionSerializer(sub).data)
        except FeedbackSubmission.DoesNotExist:
            pass
        try:
            sub = ContactSubmission.objects.get(pk=pk, user=request.user)
            return Response(ContactSubmissionSerializer(sub).data)
        except ContactSubmission.DoesNotExist:
            pass
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
