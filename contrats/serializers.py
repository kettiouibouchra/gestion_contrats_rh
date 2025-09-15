from rest_framework import serializers
from .models import Contrat
from django.contrib.auth import get_user_model
User = get_user_model()

class ContratSerializer(serializers.ModelSerializer):
    employe = serializers.StringRelatedField(read_only=True)         # nested read
    employe_id = serializers.PrimaryKeyRelatedField(
        write_only=True, 
        source='employe', 
        queryset=User.objects.all()
    )
    
    class Meta:
        model = Contrat
        fields = ['id','type','employe','employe_id','date_debut','date_fin','fichier','statut','date_creation','cree_par']
        read_only_fields = ['date_creation','cree_par','employe']