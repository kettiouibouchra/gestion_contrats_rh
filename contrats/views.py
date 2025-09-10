from rest_framework import viewsets, permissions, decorators, response, status
from .models import Contrat
from .serializers import ContratSerializer

class IsRH(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role == 'rh'
        )

class ContratViewSet(viewsets.ModelViewSet):
    serializer_class = ContratSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Contrat.objects.select_related('employe')
        if not user.is_authenticated:
            return Contrat.objects.none()  # sécurité supplémentaire
        if user.role == 'rh':
            return qs
        if user.role == 'manager':
            return qs.filter(employe__manager=user)
        return qs.filter(employe=user)

    def perform_create(self, serializer):
        serializer.save(cree_par=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'archiver']:
            permission_classes = [IsRH]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]

    @decorators.action(detail=True, methods=['post'], permission_classes=[IsRH])
    def archiver(self, request, pk=None):
        contrat = self.get_object()
        contrat.statut = "Archive"
        contrat.save(update_fields=["statut"])
        return response.Response(
            {"status": "Contrat archivé"},
            status=status.HTTP_200_OK
        )


