from django.db import models
from django.conf import settings

class Contrat(models.Model):
    TYPE_CHOICES = (
        ('CDI', 'CDI'),
        ('CDD', 'CDD'),
        ('STAGE', 'Stage'),
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    employe = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='contrats')
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True)
    fichier = models.FileField(upload_to='contrats/')
    statut = models.CharField(max_length=20, default='Actif')
    date_creation = models.DateTimeField(auto_now_add=True)
    cree_par = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='contrats_crees')

    def __str__(self):
        return f"{self.employe.get_full_name()} - {self.type}"

