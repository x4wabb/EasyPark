from rest_framework import generics, permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS
from django.conf import settings
from django.db.models import Count, Q
from django.utils.dateparse import parse_datetime
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import re 

# Imports for custom utilities
from .utils.email import send_reservation_email
from .utils.pdf import generate_pdf_receipt
from .utils.sms import send_sms

# Third-party imports
import stripe
import cv2
import pytesseract
import numpy as np
from datetime import date, datetime # Added datetime import for clarity in ReserveAndPayView

# Local app imports (models and serializers)
from .models import Reservation, Zone, ParkingSpot
from .serializers import ReservationSerializer, ZoneSerializer, ParkingSpotSerializer

# Stripe API key configuration
stripe.api_key = settings.STRIPE_SECRET_KEY

# Tesseract OCR executable path configuration
# IMPORTANT: Ensure this path is correct for your system.
# For Linux/macOS, it might just be 'tesseract' or its full path like '/usr/bin/tesseract'.
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


# --- Custom Permissions ---
class IsAdminUser(BasePermission):
    """
    Custom permission to only allow admin users (is_staff) to access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to allow read-only access for authenticated users,
    and full (read/write) access for admin users (is_staff).
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated request
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_authenticated and request.user.is_staff


# --- Reservation Views ---
class ReservationCreateView(generics.CreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        spot_id = request.data.get("spot")
        start_time = request.data.get("start_time")
        end_time = request.data.get("end_time")
        plate_number = request.data.get("plate_number")

        if not all([spot_id, start_time, end_time]):
            return Response({"error": "All fields are required."}, status=400)

        start_dt = parse_datetime(start_time)
        end_dt = parse_datetime(end_time)

        if not start_dt or not end_dt or start_dt >= end_dt:
            return Response({"error": "Invalid start or end time."}, status=400)

        try:
            spot = ParkingSpot.objects.get(id=spot_id)
        except ParkingSpot.DoesNotExist:
            return Response({"error": "Selected spot does not exist."}, status=404)

        reservation = Reservation.objects.create(
            user=user,
            spot=spot,
            start_time=start_dt,
            end_time=end_dt,
            plate_number=plate_number,
        )

        spot.is_reserved = True
        spot.save()

        serializer = self.get_serializer(reservation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user).order_by('-created_at')

class AdminReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Reservation.objects.all().order_by('-created_at')


# --- Zone Views ---
class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.annotate(
        spot_count=Count('spots'),
        available=Count('spots', filter=Q(spots__is_reserved=False))
    )
    serializer_class = ZoneSerializer
    permission_classes = [IsAdminOrReadOnly]

# --- Parking Spot Views ---
class ParkingSpotViewSet(viewsets.ModelViewSet):
    serializer_class = ParkingSpotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        zone_id = self.request.query_params.get("zone_id")
        return ParkingSpot.objects.filter(zone_id=zone_id) if zone_id else ParkingSpot.objects.all()

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def generate_spots(request):
    zone_id = request.data.get("zone_id")
    count = request.data.get("count")

    if not zone_id or not count:
        return Response({"error": "zone_id and count are required."}, status=400)

    try:
        count = int(count)
        if count <= 0:
            raise ValueError
    except ValueError:
        return Response({"error": "Count must be a positive integer."}, status=400)

    try:
        zone = Zone.objects.get(id=zone_id)
    except Zone.DoesNotExist:
        return Response({"error": "Zone not found."}, status=404)

    last_number = ParkingSpot.objects.filter(zone=zone).count()
    for i in range(1, count + 1):
        ParkingSpot.objects.create(
            zone=zone,
            spot_number=str(last_number + i),
            latitude=zone.latitude,
            longitude=zone.longitude,
        )

    return Response({"message": f"{count} spots created in zone '{zone.name}'"}, status=201)

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def available_spots(request):
    zone_id = request.query_params.get("zone_id")
    start = parse_datetime(request.query_params.get("start"))
    end = parse_datetime(request.query_params.get("end"))

    if not zone_id or not start or not end or start >= end:
        return Response({"error": "Invalid or missing parameters."}, status=400)

    all_spots = ParkingSpot.objects.filter(zone_id=zone_id)
    reserved_ids = Reservation.objects.filter(
        spot__in=all_spots,
        start_time__lt=end,
        end_time__gt=start
    ).values_list("spot_id", flat=True)

    available = all_spots.exclude(id__in=reserved_ids)
    serializer = ParkingSpotSerializer(available, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def reservation_by_session(request):
    session_id = request.GET.get("session_id")
    print("🟢 SESSION ID RECEIVED:", session_id)

    try:
        reservation = Reservation.objects.get(stripe_session_id=session_id)
        print("✅ RESERVATION FOUND:", reservation)
    except Exception as e:
        print("❌ ERROR WHILE FETCHING RESERVATION:", e)
        return Response({"error": str(e)}, status=500)

    serializer = ReservationSerializer(reservation)
    return Response(serializer.data)


class ReserveAndPayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        spot_id = request.data.get("spot")
        start_time = request.data.get("start_time")
        end_time = request.data.get("end_time")
        plate_number = user.plate_number # This line uses plate_number from user object as per your original code

        if not all([spot_id, start_time, end_time, plate_number]):
            return Response({"error": "Missing reservation data."}, status=400)

        try:
            spot = ParkingSpot.objects.select_related('zone').get(id=spot_id)
            zone = spot.zone

            # from datetime import datetime # Already imported at the top
            # from django.utils.dateparse import parse_datetime # Already imported at the top

            start_dt = parse_datetime(start_time)
            end_dt = parse_datetime(end_time)
            duration_hours = (end_dt - start_dt).total_seconds() / 3600

            if duration_hours <= 1:
                price = 250
            elif duration_hours <= 2:
                price = 400
            elif duration_hours <= 3:
                price = 500
            else:
                price = 600

            unit_amount = price * 100

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'try',
                        'product_data': {
                            'name': f'EasyPark Reservation - Zone: {zone.name} Spot: #{spot.spot_number}',
                        },
                        'unit_amount': unit_amount,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"http://localhost:5173/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url="http://localhost:5173/cancel",
                metadata={
                    "user_id": str(user.id),
                    "spot_id": str(spot.id),
                    "start_time": start_time,
                    "end_time": end_time,
                    "plate_number": plate_number
                }
            )

            return Response({'session_url': session.url})

        except ObjectDoesNotExist:
            return Response({"error": "Spot not found."}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        from users.models import User # Imported locally as in your original code

        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response(status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            metadata = session.get('metadata', {})

            try:
                user_id = metadata.get('user_id')
                spot_id = metadata.get('spot_id')
                start_time = metadata.get('start_time')
                end_time = metadata.get('end_time')
                plate_number = metadata.get('plate_number')

                if not user_id or not spot_id:
                    print("⚠️ Missing critical metadata. Skipping reservation creation.")
                    return Response(status=200)

                user = User.objects.get(id=user_id)
                spot = ParkingSpot.objects.get(id=spot_id)

                reservation = Reservation.objects.create(
                    user=user,
                    spot=spot,
                    start_time=parse_datetime(start_time),
                    end_time=parse_datetime(end_time),
                    plate_number=plate_number,
                    stripe_session_id=session['id']
                )
                spot.is_reserved = True
                spot.save()

                try:
                    price = int(session['amount_total']) / 100
                    receipt_path = generate_pdf_receipt(reservation, user, price)
                    receipt_url = request.build_absolute_uri("/" + receipt_path)
                except Exception as e:
                    print("PDF generation failed:", e)

                if user.email:
                    send_reservation_email(
                        user.email,
                        "✅ EasyPark Reservation Confirmed",
                        f"Zone: {reservation.spot.zone.name}\nSpot: #{reservation.spot.spot_number}\n"
                        f"Plate: {reservation.plate_number}\n"
                        f"From: {reservation.start_time.strftime('%Y-%m-%d %H:%M')}\n"
                        f"To: {reservation.end_time.strftime('%Y-%m-%d %H:%M')}\n"
                        f"Price: {price} TRY"
                    )

                if user.phone_number:
                    send_sms(
                        user.phone_number,
                        f"✅ EasyPark: Reservation confirmed\nZone: {reservation.spot.zone.name}\nSpot: #{reservation.spot.spot_number}\n"
                        f"{reservation.start_time.strftime('%H:%M')} → {reservation.end_time.strftime('%H:%M')}"
                    )

            except Exception as e:
                print("❌ Reservation webhook error:", e)

        return Response(status=200)


class LicensePlateRecognitionView(APIView):
    def post(self, request, *args, **kwargs):
        if 'image' not in request.FILES:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['image']
        try:
            image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
        except Exception as e:
            return Response({'error': 'Image decoding failed.'}, status=status.HTTP_400_BAD_REQUEST)

        if image is None:
            return Response({'error': 'Invalid image.'}, status=status.HTTP_400_BAD_REQUEST)

        # Preprocess
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        closed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
        resized = cv2.resize(closed, (800, 800), interpolation=cv2.INTER_AREA)

        custom_config = r'--oem 3 --psm 7 -l eng -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        text = pytesseract.image_to_string(resized, config=custom_config)
        cleaned = ''.join(filter(str.isalnum, text)).upper()

        plate_pattern = r'\d{2}[A-Z]{3}\d{3}'
        match = re.search(plate_pattern, cleaned)
        cleaned_plate_number = match.group(0) if match else ""

        if not cleaned_plate_number:
            return Response({
                'detail': 'invalid_plate_image',
                'message': 'No valid license plate pattern detected.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            reservation = Reservation.objects.filter(
                plate_number__iexact=cleaned_plate_number,
                is_active=True
            ).select_related('spot__zone').first()

            if reservation:
                return Response({
                    'plate_number': cleaned_plate_number,
                    'access': True,
                    'message': 'Access granted.',
                    'zone': reservation.spot.zone.name,
                    'spot': reservation.spot.spot_number,
                })

            return Response({
                'plate_number': cleaned_plate_number,
                'access': False,
                'message': 'Access denied. No active reservation.',
                'zone': None,
                'spot': None,
            }, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({
                'plate_number': None,
                'access': False,
                'message': 'Internal server error during reservation lookup.',
                'zone': None,
                'spot': None,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# --- Admin Dashboard Summary ---
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_summary(request):
    total_zones = Zone.objects.count()
    total_spots = ParkingSpot.objects.count()
    reserved_spots = ParkingSpot.objects.filter(is_reserved=True).count()
    available_spots = total_spots - reserved_spots
    
    today = date.today()
    today_reservations = Reservation.objects.filter(start_time__date=today).count()

    return Response({
        "total_zones": total_zones,
        "total_spots": total_spots,
        "reserved_spots": reserved_spots,
        "available_spots": available_spots,
        "today_reservations": today_reservations,
    })