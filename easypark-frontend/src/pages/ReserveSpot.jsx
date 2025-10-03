import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const ReserveSpot = ({ zoneId, spotId }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      toast.error("Please select both start and end time.");
      return;
    }

    try {
      const res = await axiosInstance.post("parking/reservations/create/", {
        zone: zoneId,
        spot: spotId,
        start_time: startTime,
        end_time: endTime,
      });

      toast.success("Reservation created!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create reservation.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Poppins, sans-serif" }}>
      <h2>Reserve Spot #{spotId}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Start Time:</label>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />

        <label>End Time:</label>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

        <button type="submit" style={{ marginTop: "1rem", padding: "0.75rem 1.25rem" }}>
          Reserve
        </button>
      </form>
    </div>
  );
};

export default ReserveSpot;
