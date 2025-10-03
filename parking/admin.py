from django.contrib import admin
from django import forms
from .models import Zone, ParkingSpot, Reservation

# Custom Admin Form for Zone with Leaflet Picker
class ZoneAdminForm(forms.ModelForm):
    class Meta:
        model = Zone
        fields = '__all__'

    class Media:
        css = {
            'all': ('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',)
        }
        js = (
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            'js/zone_map_picker.js',
        )

# Admin action to mark spots as available
@admin.action(description="Mark selected spots as available")
def mark_spots_available(modeladmin, request, queryset):
    updated = queryset.update(is_reserved=False)
    modeladmin.message_user(request, f"{updated} spot(s) marked as available.")

# Register Zone with map form and auto spot generation
@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    form = ZoneAdminForm

    def save_model(self, request, obj, form, change):
        # Save the Zone first
        super().save_model(request, obj, form, change)

        # Generate spots if creating new zone and no spots exist
        if not change and obj.spots.count() == 0:
            for i in range(1, obj.capacity + 1):
                ParkingSpot.objects.create(
                    zone=obj,
                    spot_number=str(i),  
                    is_reserved=False
                )

# Register ParkingSpot with list display and action
@admin.register(ParkingSpot)
class ParkingSpotAdmin(admin.ModelAdmin):
    list_display = ("zone", "spot_number", "is_reserved", "is_accessible")
    actions = [mark_spots_available]

# Register Reservation with list display
@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ("user", "spot", "start_time", "end_time", "is_active")
