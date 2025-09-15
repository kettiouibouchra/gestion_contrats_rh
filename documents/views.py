from rest_framework import viewsets, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Document
from .serializers import DocumentSerializer
from users.permissions import IsRH, IsManager  # ton fichier permissions

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related('proprietaire').all()
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]  # permet multipart/form-data
    # read: authenticated; create: owner or RH; delete/edit: RH
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Document.objects.none()
        if user.role == 'rh':
            return Document.objects.all()
        if user.role == 'manager':
            # documents visibles des employés de ce manager
            return Document.objects.filter(proprietaire__manager=user)
        return Document.objects.filter(proprietaire=user)

    def perform_create(self, serializer):
        # owner = request.user
        serializer.save(proprietaire=self.request.user)
