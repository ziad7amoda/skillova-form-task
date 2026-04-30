from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class SubmissionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='tester', email='t@t.com', password='pass1234'
        )

    def test_feedback_default_status_is_pending(self):
        from submissions.models import FeedbackSubmission
        fb = FeedbackSubmission.objects.create(
            user=self.user, title='T', message='M', rating=3, category='bug'
        )
        self.assertEqual(fb.status, 'pending')

    def test_feedback_rating_stored_correctly(self):
        from submissions.models import FeedbackSubmission
        fb = FeedbackSubmission.objects.create(
            user=self.user, title='T', message='M', rating=5, category='feature'
        )
        self.assertEqual(fb.rating, 5)

    def test_contact_default_status_is_pending(self):
        from submissions.models import ContactSubmission
        ct = ContactSubmission.objects.create(
            user=self.user, subject='S', body='B', priority='low'
        )
        self.assertEqual(ct.status, 'pending')

    def test_contact_priority_stored_correctly(self):
        from submissions.models import ContactSubmission
        ct = ContactSubmission.objects.create(
            user=self.user, subject='S', body='B', priority='high'
        )
        self.assertEqual(ct.priority, 'high')


from rest_framework import status
from rest_framework.test import APITestCase


class SubmissionAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='alice', email='alice@example.com', password='securepass'
        )
        res = self.client.post('/api/auth/login/', {'username': 'alice', 'password': 'securepass'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {res.data["access"]}')

    def test_create_feedback_success(self):
        data = {'title': 'Bug report', 'message': 'Something broke', 'rating': 3, 'category': 'bug'}
        response = self.client.post('/api/submissions/feedback/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['type'], 'feedback')
        self.assertEqual(response.data['status'], 'pending')

    def test_create_feedback_invalid_rating_returns_400(self):
        data = {'title': 'T', 'message': 'M', 'rating': 10, 'category': 'bug'}
        response = self.client.post('/api/submissions/feedback/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rating', response.data)

    def test_create_contact_success(self):
        data = {'subject': 'Help needed', 'body': 'Please assist', 'priority': 'high'}
        response = self.client.post('/api/submissions/contact/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['type'], 'contact')

    def test_my_submissions_returns_only_own(self):
        other = User.objects.create_user(
            username='bob', email='bob@example.com', password='securepass'
        )
        from submissions.models import FeedbackSubmission
        FeedbackSubmission.objects.create(
            user=self.user, title='Mine', message='msg', rating=4, category='general'
        )
        FeedbackSubmission.objects.create(
            user=other, title='Not mine', message='msg', rating=4, category='general'
        )
        response = self.client.get('/api/submissions/my/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_my_submissions_unauthenticated_returns_401(self):
        self.client.credentials()
        response = self.client.get('/api/submissions/my/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_feedback_status_is_readonly(self):
        data = {'title': 'T', 'message': 'M', 'rating': 3, 'category': 'bug', 'status': 'closed'}
        response = self.client.post('/api/submissions/feedback/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'pending')

    def test_my_submission_detail_returns_correct_object(self):
        data = {'title': 'Detail test', 'message': 'msg', 'rating': 2, 'category': 'general'}
        create_res = self.client.post('/api/submissions/feedback/', data)
        sub_id = create_res.data['id']
        response = self.client.get(f'/api/submissions/my/{sub_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Detail test')

    def test_my_submission_detail_other_user_returns_404(self):
        other = User.objects.create_user(
            username='carol', email='carol@example.com', password='securepass'
        )
        from submissions.models import ContactSubmission
        sub = ContactSubmission.objects.create(
            user=other, subject='S', body='B', priority='low'
        )
        response = self.client.get(f'/api/submissions/my/{sub.pk}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
