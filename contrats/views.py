from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Contrat
from .serializers import ContratSerializer

class IsRH(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'rh')

class ContratViewSet(viewsets.ModelViewSet):
    serializer_class = ContratSerializer
    parser_classes = [MultiPartParser, FormParser]  # <--- Ajout pour upload fichier

    def get_queryset(self):
        user = self.request.user
        qs = Contrat.objects.select_related('employe')
        if user.role == 'rh':
            return qs
        if user.role == 'manager':
            return qs.filter(employe__manager=user)
        return qs.filter(employe=user)

    def perform_create(self, serializer):
        serializer.save(cree_par=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsRH()]
        return [permissions.IsAuthenticated()]
    
