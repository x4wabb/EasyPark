from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Reservation, ParkingSpot, Zone

User = get_user_model()

class ZoneSerializer(serializers.ModelSerializer):
    spot_count = serializers.IntegerField(read_only=True)
    available = serializers.IntegerField(read_only=True)

    class Meta:
        model = Zone
        fields = [
            "id",
            "name",
            "district",
            "capacity",
            "latitude",
            "longitude",
            "spot_count",
            "available"
        ]


class ParkingSpotSerializer(serializers.ModelSerializer):
    zone = ZoneSerializer()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

    class Meta:
        model = ParkingSpot
        fields = [
            "id",
            "zone",
            "spot_number",
            "is_reserved",
            "is_accessible",
            "latitude",
            "longitude"
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']  # add other fields if needed

class ReservationSerializer(serializers.ModelSerializer):
    spot = ParkingSpotSerializer(read_only=True)
    plate_number = serializers.CharField(read_only=True)
    pdf_receipt = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)  
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

    def get_pdf_receipt(self, obj):
        if obj.stripe_session_id:
            return f"http://localhost:8000/media/receipts/receipt_{obj.stripe_session_id}.pdf"
        return None
    
    def get_payment_status(self, obj):
        return "✅ Paid" if obj.stripe_session_id else "❌ Unpaid"
