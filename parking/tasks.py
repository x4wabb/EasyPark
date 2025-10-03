from datetime import timedelta
from django.utils.timezone import now
from .models import Reservation
from celery import shared_task


@shared_task
def expire_no_shows():
    from datetime import timedelta
    from django.utils.timezone import now
    from .models import Reservation

    threshold = now() - timedelta(minutes=30)
    no_shows = Reservation.objects.filter(is_active=True, start_time__lt=threshold)

    for res in no_shows:
        res.is_active = False
        res.save()
        print(f"⛔ Reservation {res.id} auto-expired.")