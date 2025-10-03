document.addEventListener("DOMContentLoaded", function () {
console.log("📍 zone_map_picker.js loaded");
  const latInput = document.getElementById("id_latitude");
  const lngInput = document.getElementById("id_longitude");

  if (!latInput || !lngInput) return;

  const mapDiv = document.createElement("div");
  mapDiv.id = "zone-map";
  mapDiv.style = "height: 300px; margin-top: 1rem; border-radius: 8px;";
  lngInput.closest(".form-row")?.after(mapDiv);

  const initialLat = parseFloat(latInput.value) || 41.0082;
  const initialLng = parseFloat(lngInput.value) || 28.9784;

  const map = L.map("zone-map").setView([initialLat, initialLng], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

  marker.on("dragend", function (e) {
    const { lat, lng } = marker.getLatLng();
    latInput.value = lat.toFixed(6);
    lngInput.value = lng.toFixed(6);
  });

  map.on("click", function (e) {
    marker.setLatLng(e.latlng);
    latInput.value = e.latlng.lat.toFixed(6);
    lngInput.value = e.latlng.lng.toFixed(6);
  });
  console.log("✅ Map init script reached");
});

