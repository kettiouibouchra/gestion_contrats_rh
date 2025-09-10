from rest_framework import serializers
from .models import Contrat

class ContratSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrat
        fields = '__all__'
        read_only_fields = ('date_creation', 'cree_par')
