from django.core.management.base import BaseCommand
from django.utils.timezone import now, timedelta
from parking.models import Reservation
from parking.utils.sms import send_sms

class Command(BaseCommand):
    help = 'Send SMS reminders for upcoming reservation expirations and release expired spots.'

    def handle(self, *args, **kwargs):
        current_time = now()
        reminder_window = current_time + timedelta(minutes=10)

        # 🔔 Send reminders for reservations ending soon
        ending_soon = Reservation.objects.filter(
            end_time__range=(current_time, reminder_window),
            spot__is_reserved=True
        )

        if not ending_soon.exists():
            self.stdout.write(self.style.SUCCESS("No upcoming reservations to notify."))
        else:
            for reservation in ending_soon:
                user = reservation.user
                if not user.phone_number:
                    continue

                end_time_str = reservation.end_time.strftime('%H:%M')
                zone_name = reservation.spot.zone.name
                spot_number = reservation.spot.spot_number

                message = (
                    f"⏰ EasyPark Reminder:\n"
                    f"Your reservation for Spot #{spot_number} in Zone {zone_name} ends at {end_time_str}.\n"
                    f"Please vacate the spot on time."
                )

                send_sms(user.phone_number, message)
                self.stdout.write(f"🔔 Reminder sent to {user.username} ({user.phone_number})")

        # 🔓 Auto-release expired spots
        expired_reservations = Reservation.objects.filter(
            end_time__lt=current_time,
            spot__is_reserved=True
        )

        for reservation in expired_reservations:
            reservation.spot.is_reserved = False
            reservation.spot.save()
            self.stdout.write(f"✅ Released Spot #{reservation.spot.spot_number} (Zone: {reservation.spot.zone.name})")

        self.stdout.write(self.style.SUCCESS("✅ Reservation reminders sent and expired spots released."))
