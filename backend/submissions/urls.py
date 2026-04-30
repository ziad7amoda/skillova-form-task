from django.urls import path

from .views import FeedbackCreateView, ContactCreateView, MySubmissionsView, MySubmissionDetailView

urlpatterns = [
    path('feedback/', FeedbackCreateView.as_view()),
    path('contact/', ContactCreateView.as_view()),
    path('my/', MySubmissionsView.as_view()),
    path('my/<int:pk>/', MySubmissionDetailView.as_view()),
]
