// ✅ Success.jsx (Frontend)
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
  if (!sessionId) {
    toast.error("Missing session ID.");
    setLoading(false);
    return;
  }

  axiosInstance
    .get("parking/reservations/by-session/", {
      params: { session_id: sessionId }
    })
    .then((res) => {
      localStorage.setItem("latestReservation", JSON.stringify(res.data));
      setConfirmed(true);
    })
    .catch(() => {
      toast.error("Reservation not found.");
      setConfirmed(false);
    })
    .finally(() => setLoading(false));
}, [sessionId]);


  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top left, #0a2b52, #041829)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Poppins, sans-serif",
      padding: "2rem",
      color: "#fff"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "3rem 2rem",
        boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
        textAlign: "center",
        animation: "fadeIn 0.8s ease-out",
        color: "#082742"
      }}>
        {loading ? (
          <>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⏳</div>
            <h2>Just a moment...</h2>
            <p>We’re processing your reservation details.</p>
          </>
        ) : confirmed ? (
          <>
            <div style={{ fontSize: "3rem" }}>🎉</div>
            <h2>Reservation Confirmed!</h2>
            <p>Your payment was successful and your parking spot is now booked.</p>
            <button
              onClick={() => navigate("/reservation-success")}
              style={{
                backgroundColor: "#FDE047",
                color: "#082742",
                padding: "0.9rem 1.8rem",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer"
              }}
            >
              View Reservation
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: "3rem" }}>❌</div>
            <h2>Something Went Wrong</h2>
            <p>Unfortunately, your reservation couldn’t be completed.</p>
            <button
              onClick={() => navigate("/find")}
              style={{
                backgroundColor: "#082742",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;
