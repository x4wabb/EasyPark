from django.core.management.base import BaseCommand
from parking.models import Zone

class Command(BaseCommand):
    help = 'Seed the database with parking zones in Istanbul'

    def handle(self, *args, **kwargs):
        zones = [
            {"name": "Üsküdar Meydanı", "district": "Üsküdar", "capacity": 40},
            {"name": "Kadıköy Rıhtım", "district": "Kadıköy", "capacity": 60},
            {"name": "Taksim Square", "district": "Beyoğlu", "capacity": 70},
            {"name": "Beşiktaş Sahil", "district": "Beşiktaş", "capacity": 55},
            {"name": "Zorlu AVM", "district": "Beşiktaş", "capacity": 100},
            {"name": "Harem Otogar", "district": "Üsküdar", "capacity": 80},
            {"name": "Cevahir AVM", "district": "Şişli", "capacity": 90},
            {"name": "Bakırköy Metro", "district": "Bakırköy", "capacity": 65},
            {"name": "Mall of Istanbul", "district": "Başakşehir", "capacity": 120},
        ]

        created = 0
        for z in zones:
            obj, was_created = Zone.objects.get_or_create(name=z["name"], defaults=z)
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"✅ {created} zones seeded."))
