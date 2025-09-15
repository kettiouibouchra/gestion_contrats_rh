from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    proprietaire = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Document
        fields = ['id','proprietaire','nom','type','fichier','date_upload','visible_par_manager','valide_par_rh']
        read_only_fields = ['proprietaire','date_upload']
