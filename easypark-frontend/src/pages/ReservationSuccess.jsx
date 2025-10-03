import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReservationSuccess = () => {
  const [reservation, setReservation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("latestReservation");
    if (!data) {
      navigate("/");
    } else {
      setReservation(JSON.parse(data));
    }
  }, [navigate]);

  if (!reservation) return null;

  const { spot, start_time, end_time } = reservation;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#082742",
        padding: "3rem 1rem",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#082742",
      }}
    >
      <h1 style={{ fontSize: "2.3rem", marginBottom: "1rem", color: "#FFFFFF" }}>
        📄 Reservation Details
      </h1>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <p style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
          🅿️ Spot Number: <span style={{ fontWeight: "normal" }}>#{spot.spot_number}</span>
        </p>

        <p style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
          📍 Zone: <span style={{ fontWeight: "normal" }}>{spot.zone.name}</span>
        </p>

        <p style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
          🕒 Start Time:{" "}
          <span style={{ fontWeight: "normal" }}>
            {new Date(start_time).toLocaleString()}
          </span>
        </p>

        <p style={{ marginBottom: "1rem", fontWeight: "bold" }}>
          ⏳ End Time:{" "}
          <span style={{ fontWeight: "normal" }}>
            {new Date(end_time).toLocaleString()}
          </span>
        </p>

        <button
          onClick={() => navigate("/profile")}
          style={{
            marginTop: "1rem",
            padding: "0.7rem 1.5rem",
            backgroundColor: "#082742",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Back to Profile
        </button>

        {/*<button
          onClick={() => navigate("/plate")}
          style={{
            marginTop: "1rem",
            padding: "0.7rem 1.5rem",
            backgroundColor: "#ffc400",
            color: "#082742",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          🔍 Plate Recognition
        </button>*/}
      </div>
    </div>
  );
};

export default ReservationSuccess;
