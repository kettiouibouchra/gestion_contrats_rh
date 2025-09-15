from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
User = get_user_model()

class DocumentUploadTest(APITestCase):
    def setUp(self):
        self.rh = User.objects.create_user(username='rh', password='pass', role='rh')

    def test_upload_document_rh(self):
        self.client.force_authenticate(self.rh)
        url = reverse('document-list')  
        with open('backend/fixtures/test.pdf','rb') as f:
            resp = self.client.post(url, {'nom':'t','type':'CV','fichier':f}, format='multipart')
        self.assertEqual(resp.status_code, 201)

