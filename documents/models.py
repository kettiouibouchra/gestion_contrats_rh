from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

def validate_file_size(file):
    max_mb = 10
    if file.size > max_mb * 1024 * 1024:
        raise ValidationError(f"Max file size is {max_mb}MB")

def validate_extension(file):
    allowed = ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg']
    ext = file.name.split('.')[-1].lower()
    if ext not in allowed:
        raise ValidationError("Extension not allowed.")

class Document(models.Model):
    TYPE_CHOICES = (
        ('CV','CV'),
        ('ATTESTATION','Attestation'),
        ('AUTRE','Autre'),
    )
    proprietaire = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    nom = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='AUTRE')
    fichier = models.FileField(upload_to='documents/', validators=[validate_file_size, validate_extension])
    date_upload = models.DateTimeField(auto_now_add=True)
    visible_par_manager = models.BooleanField(default=False)
    valide_par_rh = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nom} ({self.proprietaire})"

