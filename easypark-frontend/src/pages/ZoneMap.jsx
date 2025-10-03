import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axiosInstance from "../utils/axiosInstance";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/page.css";

// Fix for marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ZoneMap = () => {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("parking/zones/")
      .then((res) => setZones(res.data))
      .catch((err) => console.error("Failed to load zones", err));
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-heading">📍 Parking Zones Map</h2>

      <MapContainer
        center={[41.0082, 28.9784]} // Istanbul center
        zoom={12}
        style={{ height: "75vh", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {zones.map((zone) => (
          <Marker key={zone.id} position={[zone.latitude, zone.longitude]}>
            <Popup>
              <strong>{zone.name}</strong>
              <br />
              District: {zone.district}
              <br />
              Capacity: {zone.capacity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ZoneMap;
