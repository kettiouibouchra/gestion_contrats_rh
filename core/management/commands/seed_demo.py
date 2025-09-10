from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker
from users.models import Service
from contrats.models import Contrat
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed demo data'

    def handle(self, *args, **options):
        fake = Faker('fr_FR')

        # services
        services = []
        for _ in range(5):
            s, _ = Service.objects.get_or_create(nom=fake.job())
            services.append(s)

        # RH
        rh, _ = User.objects.get_or_create(username='rh', defaults={'email':'rh@example.com','role':'rh'})
        rh.set_password('password')
        rh.save()

        # managers
        managers = []
        for i in range(3):
            m = User.objects.create(username=f'manager{i}', email=f'manager{i}@example.com', role='manager')
            m.set_password('password')
            m.service = random.choice(services)
            m.save()
            managers.append(m)

        # employés
        employees = []
        for i in range(20):
            u = User.objects.create(username=f'user{i}', email=f'user{i}@example.com', role='employe')
            u.set_password('password')
            u.manager = random.choice(managers)
            u.service = random.choice(services)
            u.save()
            employees.append(u)

        # contrats
        types = ['CDI','CDD','STAGE']
        for emp in employees:
            for _ in range(random.randint(1,2)):
                C = Contrat.objects.create(
                    type=random.choice(types),
                    employe=emp,
                    date_debut=fake.date_between(start_date='-3y', end_date='today'),
                    statut='Actif',
                    cree_par=rh
                )
        self.stdout.write(self.style.SUCCESS('Seed demo complete'))