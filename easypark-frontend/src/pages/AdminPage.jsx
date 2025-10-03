import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import '../styles/page.css';

const AdminPage = () => {
  const [zones, setZones] = useState([]);
  const [generateCount, setGenerateCount] = useState({});
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tab, setTab] = useState("zones");
  const [newZone, setNewZone] = useState({
    name: "", district: "", capacity: "", latitude: "", longitude: ""
  });
  const [editingZone, setEditingZone] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
    fetchZones();
    fetchStats();
    fetchReservations();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await axiosInstance.get("users/profile/");
      if (res.data.is_staff) setIsAdmin(true);
    } catch {
      toast.error("Access Denied");
    }
  };

  const fetchZones = async () => {
    try {
      const res = await axiosInstance.get("parking/zones/");
      const data = res.data.results || res.data;
      setZones(data);
    } catch {
      toast.error("Failed to load zones.");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("parking/dashboard/summary/");
      setStats(res.data);
    } catch {
      toast.error("Failed to load stats.");
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await axiosInstance.get("parking/reservations/all/");
      setReservations(res.data);
    } catch {
      toast.error("Failed to load reservations.");
    }
  };

  const handleCreateOrUpdateZone = async (e) => {
    e.preventDefault();
    const action = editingZone ? "put" : "post";
    const url = editingZone ? `parking/zones/${editingZone.id}/` : "parking/zones/";
    try {
      await axiosInstance[action](url, newZone);
      toast.success(editingZone ? "Zone updated!" : "Zone created!");
      setNewZone({ name: "", district: "", capacity: "", latitude: "", longitude: "" });
      setEditingZone(null);
      fetchZones();
    } catch {
      toast.error("Failed to save zone.");
    }
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setNewZone({ ...zone });
  };

  const handleDeleteZone = async (id) => {
    if (!window.confirm("Delete this zone?")) return;
    try {
      await axiosInstance.delete(`parking/zones/${id}/`);
      toast.success("Zone deleted.");
      fetchZones();
    } catch {
      toast.error("Failed to delete zone.");
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "2rem", color: "white", textAlign: "center" }}>
        🔒 Admin Access Required
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#082742",
        color: "white",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "2rem" }}>🛠 Admin Control Panel</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {["zones", "stats", "reservations"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              backgroundColor: tab === t ? "#FFD700" : "white",
              color: "#082742",
              border: "none",
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "zones" && (
        <>
          <form onSubmit={handleCreateOrUpdateZone} style={{ marginBottom: "2rem" }}>
            <h3>{editingZone ? "✏️ Edit Zone" : "➕ Add New Zone"}</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {["name", "district", "capacity", "latitude", "longitude"].map((f) => (
                <input
                  key={f}
                  type={f === "capacity" ? "number" : "text"}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={newZone[f]}
                  onChange={(e) => setNewZone({ ...newZone, [f]: e.target.value })}
                  required={f !== "latitude" && f !== "longitude"}
                  style={{
                    padding: "0.8rem",
                    borderRadius: "6px",
                    border: "none",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
            <button
              type="submit"
              style={{
                marginTop: "1rem",
                backgroundColor: "#44aa44",
                color: "white",
                padding: "0.6rem 1.2rem",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              {editingZone ? "Update Zone" : "Create Zone"}
            </button>
          </form>

          <div style={{ display: "grid", gap: "1rem" }}>
            {zones.map((zone) => (
              <div
                key={zone.id}
                style={{
                  background: "white",
                  color: "#082742",
                  padding: "1rem",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <strong style={{ fontSize: "1.2rem" }}>{zone.name}</strong> – {zone.district}
                <br />
                Capacity: {zone.capacity}
                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    onClick={() => handleEditZone(zone)}
                    style={{
                      marginRight: "1rem",
                      backgroundColor: "#082742",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.3rem 0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteZone(zone.id)}
                    style={{
                      backgroundColor: "#082742",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.3rem 0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "stats" && stats && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {["total_zones", "total_spots", "available_spots", "reserved_spots"].map((key, i) => (
            <div
              key={key}
              style={{
                backgroundColor: ["#1e88e5", "#f9a825", "#43a047", "#e53935"][i],
                padding: "1.5rem",
                borderRadius: "10px",
                minWidth: "160px",
                textAlign: "center",
                color: "white",
                boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats[key]}</div>
              <div style={{ textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "reservations" && (
        <div
          style={{
            backgroundColor: "white",
            color: "#082742",
            padding: "1.5rem",
            borderRadius: "10px",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <h3>📅 All Reservations</h3>
          {reservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {reservations.map((res) => (
                <div
                  key={res.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "1rem",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease",
                    cursor: "default",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    👤 {res.user?.username || "Unknown"}
                  </div>
                  <div>
                    📍 <strong>{res.spot?.zone?.name || "N/A"}</strong> | 🚗 Spot #{res.spot?.spot_number}
                  </div>
                  <div>
                    🕒 <strong>From:</strong> {new Date(res.start_time).toLocaleString()}
                  </div>
                  <div>
                    🕒 <strong>To:</strong> {new Date(res.end_time).toLocaleString()}
                  </div>
                  {res.plate_number && (
                    <div>
                      🔢 <strong>Plate:</strong> {res.plate_number}
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: "0.3rem",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      backgroundColor: res.stripe_session_id ? "#d4edda" : "#f8d7da",
                      color: res.stripe_session_id ? "#155724" : "#721c24",
                      fontWeight: "500",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    💳 {res.stripe_session_id ? "Paid" : "Unpaid"}
                    {res.stripe_session_id && (
                      <a
                        href={`http://localhost:8000/media/receipts/receipt_${res.stripe_session_id}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginLeft: "1rem",
                          color: "#1e88e5",
                          fontWeight: "bold",
                          textDecoration: "none",
                        }}
                      >
                        📄 Receipt
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
