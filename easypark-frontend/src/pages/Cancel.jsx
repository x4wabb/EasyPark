import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem",
        color: "#fff",
      }}
    >
      <div
        style={{
          backgroundColor: "#f9fafb",
          color: "#1e293b",
          padding: "3rem 2rem",
          borderRadius: "22px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
          animation: "fadeIn 0.8s ease-out",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>

        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#dc2626" }}>
          Payment Cancelled
        </h2>

        <p style={{ fontSize: "1.1rem", color: "#334155" }}>
          No reservation was made. Redirecting you to the homepage...
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Cancel;
