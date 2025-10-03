import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/page.css";

const descriptions = [
  "Near Exit B - Level 1, Shaded.",
  "Underground - Well Lit, Security Cameras.",
  "Next to Elevator - Covered & Convenient.",
  "Open Area - Near Entrance A.",
  "Corner Slot - Quick Entry/Exit."
];

const featuresList = [
  "Standard, Near Elevator",
  "♿ Accessible, Camera-monitored",
  "Covered, Security Patrolled",
  "Wide Access, Close to Ramp",
  "Shaded, Lighting Enhanced"
];

const SpotCard = ({ spot, onReserve, price, index }) => (
  <div className="spot-card-ui-v2">
    <div className="spot-card-info">
      <h3>🅿️ Spot #{spot.spot_number}</h3>
      <p><strong>Description:</strong> {descriptions[index % descriptions.length]}</p>
      <p><strong>Features:</strong> {featuresList[index % featuresList.length]}</p>
      <p className="spot-card-price">💰 {price} TL</p>
    </div>
    <button className="spot-card-btn" onClick={() => onReserve(spot.id)}>🚗 Reserve Now</button>
  </div>
);

const FindSpot = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const zoneId = query.get("zone");
  const navigate = useNavigate();
  useEffect(() => {
  if (!zoneId) {
    toast.error("⚠️ Zone ID is missing. Redirecting...");
    navigate("/");
  }
}, [zoneId,navigate]);


  const [zone, setZone] = useState(null);
  const [availableSpots, setAvailableSpots] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (zoneId) {
      axiosInstance.get(`parking/zones/${zoneId}/`)
        .then((res) => setZone(res.data))
        .catch(() => toast.error("❌ Failed to load zone information."));
    }
  }, [zoneId]);

  const getMinEndTime = () =>
    startTime ? new Date(startTime.getTime() + 60 * 60 * 1000) : null;

  const getMaxEndTime = () => {
    if (!startTime) return null;
    const maxEnd = new Date(startTime.getTime() + 5 * 60 * 60 * 1000);
    const endOfDay = new Date(startTime);
    endOfDay.setHours(23, 59, 59, 999);
    return maxEnd > endOfDay ? endOfDay : maxEnd;
  };

  const calculatePrice = (start, end) => {
    const duration = (end - start) / (1000 * 60 * 60);
    if (duration <= 1) return 250;
    if (duration <= 2) return 400;
    if (duration <= 3) return 500;
    return 600;
  };

 const fetchAvailableSpots = async () => {
  if (!zoneId) {
    toast.error("❌ Zone ID is missing. Please go back and select a zone.");
    return;
  }

  if (!startTime || !endTime) {
    toast.error("🕒 Select both start and end times.");
    return;
  }

  if (startTime >= endTime) {
    toast.error("End time must be after start.");
    return;
  }

  const endLimit = new Date(startTime);
  endLimit.setHours(23, 59, 59, 999);
  if (endTime > endLimit) {
    toast.error("Reservation cannot go past 11:59 PM.");
    return;
  }

  try {
    setLoading(true);
    setHasChecked(true);
    const res = await axiosInstance.get("parking/spots/available/", {
      params: {
        zone_id: zoneId,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
      },
    });
    setAvailableSpots(res.data);
  } catch {
    toast.error("❌ Could not fetch available spots.");
  } finally {
    setLoading(false);
  }
};


  const handleReserve = async (spotId) => {
  const endLimit = new Date(startTime);
  endLimit.setHours(23, 59, 59, 999);

  if (endTime > endLimit) {
    toast.error("Reservation cannot go past 11:59 PM.");
    return;
  }

  try {
    const res = await axiosInstance.post("parking/reserve-and-pay/", {
      spot: spotId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });

    console.log("🧾 Reserve Response:", res.data); // 👈 debug output

    if (res.data?.session_url) {
      window.location.href = res.data.session_url;
    } else {
      toast.error("❌ Payment session could not be started.");
      console.error("Missing session_url. Response was:", res.data);
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error || err.message || "Unknown error";
    console.error("❌ Reservation error:", errorMsg);
    toast.error("Reservation error: " + errorMsg);
  }
};



  const minDate = new Date();
  const maxDate = new Date(minDate.getTime() + 2 * 24 * 60 * 60 * 1000);

  return (
    <section className="spot-page">
      <div className="spot-container">
        <div className="spot-header">
          <h1 className="spot-title">📍 Your Spot Awaits</h1>
          <p className="spot-subtitle">Book instantly. No more circling.</p>
        </div>

        {zone && (
          <div className="spot-zone">
            <h2>{zone.name}</h2>
            <p>{zone.district} | Capacity: {zone.capacity}</p>

            <iframe
              title="zone-map"
              width="100%"
              height="200"
              style={{ borderRadius: "12px", marginTop: "0.5rem", border: "1px solid #ccc" }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${zone.latitude},${zone.longitude}&z=16&output=embed`}
            />
          </div>
        )}

        <div className="spot-form-grid">
          <div className="field">
            <label>Start Time</label>
            <DatePicker
              selected={startTime}
              onChange={(date) => {
                setStartTime(date);
                setEndTime(new Date(date.getTime() + 60 * 60 * 1000));
              }}
              showTimeSelect
              timeIntervals={15}
              timeFormat="hh:mm aa"
              dateFormat="yyyy-MM-dd hh:mm aa"
              className="input"
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Pick start time"
            />
          </div>

          <div className="field">
            <label>End Time</label>
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              timeIntervals={15}
              timeFormat="hh:mm aa"
              dateFormat="yyyy-MM-dd hh:mm aa"
              className="input"
              disabled={!startTime}
              minDate={startTime || minDate}
              maxDate={startTime}
              minTime={getMinEndTime()}
              maxTime={getMaxEndTime()}
              placeholderText="Pick end time"
            />
          </div>

          <div className="field full">
            <button className="button primary" onClick={fetchAvailableSpots}>
              🔍 Check Availability
            </button>
          </div>
        </div>

        {loading ? (
          <p className="status">🔄 Checking availability...</p>
        ) : hasChecked && availableSpots.length === 0 ? (
          <p className="status">🚫 No available spots for selected time.</p>
        ) : (
          <div className="spot-list">
            {availableSpots.map((spot, index) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                price={calculatePrice(startTime, endTime)}
                onReserve={handleReserve}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FindSpot;
