from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    reservation_by_session,
    ReservationCreateView,
    ReservationListView,
    ZoneViewSet,
    ParkingSpotViewSet,
    generate_spots,
    available_spots,
    ReserveAndPayView,
    admin_dashboard_summary,
    LicensePlateRecognitionView,
    StripeWebhookView,
    AdminReservationListView, 
    
)

# Custom paths FIRST — to avoid router conflict
urlpatterns = [
    path("spots/available/", available_spots, name="available-spots"),
    path("reservations/create/", ReservationCreateView.as_view()),
    path("reservations/", ReservationListView.as_view()),
    path("spots/generate/", generate_spots),
    path("plate-recognition/", LicensePlateRecognitionView.as_view(), name="plate-recognition"),
    path("reserve-and-pay/", ReserveAndPayView.as_view()),
    path("dashboard/summary/", admin_dashboard_summary),
    path("reservations/all/", AdminReservationListView.as_view(), name="admin-reservations"),


    # Stripe webhook URL for payment confirmation
    path("stripe/webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
    path("reservations/by-session/", reservation_by_session, name="reservation-by-session"),

]

# Router paths LAST
router = DefaultRouter()
router.register("zones", ZoneViewSet)
router.register("spots", ParkingSpotViewSet, basename="parkingspot")

urlpatterns += router.urls
