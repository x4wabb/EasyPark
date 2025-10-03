from django.core.management.base import BaseCommand
from parking.models import Zone, ParkingSpot

IST_ZONES = [
    {"name": "Taksim Square", "district": "Beyoğlu", "capacity": 25},
    {"name": "Kadıköy Center", "district": "Kadıköy", "capacity": 30},
    {"name": "Beşiktaş Square", "district": "Beşiktaş", "capacity": 20},
    {"name": "Üsküdar Pier", "district": "Üsküdar", "capacity": 30},
    {"name": "Levent Business Center", "district": "Şişli", "capacity": 40},
    {"name": "Eminönü Bazaar", "district": "Fatih", "capacity": 25},
    {"name": "Zeytinburnu Coast", "district": "Zeytinburnu", "capacity": 20},
    {"name": "Maslak Towers", "district": "Sarıyer", "capacity": 35},
    {"name": "Ataköy Marina", "district": "Bakırköy", "capacity": 20},
    {"name": "Sirkeci Station", "district": "Fatih", "capacity": 18},
    {"name": "Eyüp Sultan", "district": "Eyüpsultan", "capacity": 22},
    {"name": "Kartal Center", "district": "Kartal", "capacity": 30},
    {"name": "Beylikdüzü Center", "district": "Beylikdüzü", "capacity": 26},
]

class Command(BaseCommand):
    help = "Populate popular Istanbul parking zones and generate parking spots automatically."

    def handle(self, *args, **kwargs):
        created_count = 0
        for zone_data in IST_ZONES:
            zone, created = Zone.objects.get_or_create(
                name=zone_data["name"],
                district=zone_data["district"],
                defaults={"capacity": zone_data["capacity"]}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created zone: {zone.name}"))
                for i in range(1, zone.capacity + 1):
                    ParkingSpot.objects.create(zone=zone, spot_number=str(i))
                self.stdout.write(self.style.SUCCESS(f"→ Generated {zone.capacity} spots for {zone.name}"))
                created_count += 1
            else:
                self.stdout.write(self.style.WARNING(f"Zone already exists: {zone.name}"))

        self.stdout.write(self.style.SUCCESS(f"✅ Finished! {created_count} new zones added."))
