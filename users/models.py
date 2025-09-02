from django.db import models
from django.contrib.auth.models import AbstractUser

class Service(models.Model):
    nom = models.CharField(max_length=120, unique=True)
    def __str__(self):
        return self.nom

class User(AbstractUser):
    ROLE_CHOICES = (
        ('employe', 'Employé'),
        ('manager', 'Manager'),
        ('rh', 'Ressources Humaines'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employe')
    manager = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subordonnes')
    service = models.ForeignKey(Service, null=True, blank=True, on_delete=models.SET_NULL)
