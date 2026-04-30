from django.test import TestCase
from django.conf import settings
from django.contrib.auth import get_user_model


class UserModelTest(TestCase):
    def test_auth_user_model_points_to_accounts(self):
        self.assertEqual(settings.AUTH_USER_MODEL, 'accounts.User')

    def test_user_has_bio_field(self):
        User = get_user_model()
        user = User.objects.create_user(
            username='alice', email='alice@test.com', password='pass1234', bio='Hello'
        )
        self.assertEqual(user.bio, 'Hello')

    def test_bio_defaults_to_empty_string(self):
        User = get_user_model()
        user = User.objects.create_user(
            username='bob', email='bob@test.com', password='pass1234'
        )
        self.assertEqual(user.bio, '')


from rest_framework import status
from rest_framework.test import APITestCase


class RegisterTests(APITestCase):
    def test_register_success_returns_tokens_and_user(self):
        data = {'username': 'alice', 'email': 'alice@example.com', 'password': 'securepass'}
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], 'alice@example.com')

    def test_register_duplicate_email_returns_400(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        User.objects.create_user(username='existing', email='dup@example.com', password='pass12345')
        data = {'username': 'alice2', 'email': 'dup@example.com', 'password': 'securepass'}
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_register_short_password_returns_400(self):
        data = {'username': 'bob', 'email': 'bob@example.com', 'password': 'short'}
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)


class LoginTests(APITestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.user = User.objects.create_user(
            username='alice', email='alice@example.com', password='securepass'
        )

    def test_login_success_returns_tokens(self):
        response = self.client.post('/api/auth/login/', {'username': 'alice', 'password': 'securepass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_wrong_password_returns_401(self):
        response = self.client.post('/api/auth/login/', {'username': 'alice', 'password': 'wrongpass'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MeTests(APITestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        User.objects.create_user(username='alice', email='alice@example.com', password='securepass')
        res = self.client.post('/api/auth/login/', {'username': 'alice', 'password': 'securepass'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {res.data["access"]}')

    def test_me_returns_user_data(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'alice')

    def test_me_unauthenticated_returns_401(self):
        self.client.credentials()
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
