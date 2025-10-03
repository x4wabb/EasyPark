from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Zone(models.Model):
    name = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    capacity = models.PositiveIntegerField()
    latitude = models.FloatField(null=True, blank=True)  # Zone center lat
    longitude = models.FloatField(null=True, blank=True)  # Zone center lon

    def __str__(self):
        return self.name


class ParkingSpot(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name='spots')
    spot_number = models.CharField(max_length=10)
    is_reserved = models.BooleanField(default=False)
    is_accessible = models.BooleanField(default=False)

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    landmark_hint = models.CharField(max_length=255, blank=True)  # <-- optional


    def __str__(self):
        return f"{self.zone.name} - Spot #{self.spot_number}"


class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    spot = models.ForeignKey(ParkingSpot, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    plate_number = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    stripe_session_id = models.CharField(max_length=255, null=True, blank=True)


    def __str__(self):
        return f"{self.user} reserved {self.spot} from {self.start_time} to {self.end_time}"
