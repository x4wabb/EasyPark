from django.core.management.base import BaseCommand
from django.utils.timezone import now
from parking.models import Reservation

class Command(BaseCommand):
    help = 'Auto-releases parking spots by marking expired reservations as inactive.'

    def handle(self, *args, **kwargs):
        expired_reservations = Reservation.objects.filter(
            is_active=True,
            end_time__lt=now()
        )

        if not expired_reservations.exists():
            self.stdout.write(self.style.WARNING("✅ No expired reservations found."))
            return

        count = 0
        for reservation in expired_reservations:
            reservation.is_active = False
            reservation.save()

            reservation.spot.is_reserved = False
            reservation.spot.save()
            count += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ {count} reservation(s) expired and their spots released."
        ))
