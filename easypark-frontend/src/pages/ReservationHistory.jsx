import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "../styles/page.css";

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("parking/reservations/")
      .then((res) => {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.start_time) - new Date(a.start_time)
        );
        setReservations(sorted);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch reservations.");
        console.error("Reservation fetch error:", err);
        setLoading(false);
      });
  }, []);

  const calculateDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.round(diff / 3600000);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  };

  const handlePlateRecognition = (reservation) => {
    localStorage.setItem("selectedReservation", JSON.stringify(reservation));
    window.location.href = "/plate";
  };

  return (
    <div
      className="page-container"
      style={{
        padding: "2rem",
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#082742", marginBottom: "2rem" }}>
        📋 Reservation History
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : reservations.length === 0 ? (
        <p style={{ color: "#666" }}>You haven’t made any reservations yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {reservations.map((res) => (
            <div
              key={res.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                padding: "1.8rem",
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s ease",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem", color: "#0d3e76" }}>
                Zone:{" "}
                <span
                  style={{
                    background: "#e7f1ff",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    color: "#0d3e76",
                    fontWeight: "bold",
                  }}
                >
                  {res.spot?.zone?.name || "Unknown"}
                </span>
              </h3>

              <p><strong>Spot:</strong> #{res.spot?.spot_number || "N/A"}</p>
              <p><strong>Plate:</strong> {res.plate_number || "N/A"}</p>
              <p><strong>Start:</strong> {new Date(res.start_time).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(res.end_time).toLocaleString()}</p>
              <p><strong>Duration:</strong> {calculateDuration(res.start_time, res.end_time)}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: res.is_active ? "#28a745" : "#999",
                    fontWeight: 600,
                  }}
                >
                  {res.is_active ? " Active" : "Expired"}
                </span>
              </p>

              {res.price && (
                <p><strong>Price:</strong> {res.price} TRY</p>
              )}

              {res.pdf_receipt && (
                <p style={{ marginTop: "0.5rem" }}>
                  📄{" "}
                  <a
                    href={res.pdf_receipt}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#0077cc",
                      textDecoration: "underline",
                      fontWeight: "500",
                    }}
                  >
                    Download Receipt (PDF)
                  </a>
                </p>
              )}

              {res.is_active && (
                <button
                  onClick={() => handlePlateRecognition(res)}
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.7rem 1.4rem",
                    backgroundColor: "#082742",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0b3d7a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#082742")
                  }
                >
                  🔍 Run Plate Recognition
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationHistory;
