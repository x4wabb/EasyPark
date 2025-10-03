import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaMapMarkerAlt, FaCar } from "react-icons/fa";
import "../styles/page.css";

const Search = () => {
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("parking/zones/")
      .then((res) => {
        setZones(res.data.results || res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load parking zones.");
        setLoading(false);
      });
  }, []);

  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-page" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Hero Header */}
      <section
        style={{
          background: "linear-gradient(to right, #082742, #0d3e76)",
          padding: "4rem 2rem",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          <FaCar style={{ marginRight: "10px" }} />
          Find & Reserve Parking Instantly
        </h1>
        <p style={{ fontSize: "1.1rem", maxWidth: "700px", margin: "auto" }}>
          Search for real-time zone availability and reserve your spot in advance.
        </p>
      </section>

      {/* Search Bar */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "-2.5rem",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            width: "min(600px, 100%)",
          }}
        >
          <FaMapMarkerAlt style={{ marginRight: "1rem", color: "#0d3e76" }} />
          <input
            type="text"
            placeholder="Search by zone name or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              fontSize: "1rem",
              width: "100%",
            }}
          />
        </div>
      </section>

      {/* Zones Display */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
          padding: "4rem 2rem",
        }}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-card"></div>
          ))
        ) : filteredZones.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No matching zones found.</p>
        ) : (
          filteredZones.map((zone) => (
            <div
              key={zone.id}
              className="parking-card"
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
                textAlign: "center",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.06)";
              }}
            >
              <h3 style={{ fontSize: "1.5rem", color: "#082742", marginBottom: "0.5rem" }}>
                {zone.name}
              </h3>
              <p style={{ color: "#444", marginBottom: "0.3rem" }}>
                <strong>District:</strong> {zone.district || "N/A"}
              </p>
              <p style={{ color: "#555", marginBottom: "0.3rem" }}>
                <strong>Capacity:</strong> {zone.capacity}
              </p>
              <p style={{ color: "#555", marginBottom: "0.9rem" }}>
                <strong>Available:</strong> {zone.available}
              </p>
              <button
                onClick={() => navigate(`/find?zone=${zone.id}`)}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#FFD700",
                  color: "#082742",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
              >
                View Available Spots
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Search;
