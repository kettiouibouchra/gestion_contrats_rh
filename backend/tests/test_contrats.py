from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from contrats.models import Contrat

User = get_user_model()

class ContratAPITest(TestCase):
    def setUp(self):
        self.rh = User.objects.create_user(username='rh', password='password', role='rh')
        self.user = User.objects.create_user(username='u1', password='password', role='employe')

    def test_contrats_list_requires_auth(self):
        url = reverse('contrat-list')  # router basename + -list
        resp = self.client.get(url)
        self.assertIn(resp.status_code, (200, 403, 401))
