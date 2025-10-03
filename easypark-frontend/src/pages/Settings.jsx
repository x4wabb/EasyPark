import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "../styles/page.css";

const Settings = () => {
  const [tab, setTab] = useState("info");

  const [info, setInfo] = useState({
    username: "",
    email: "",
    phone: "",
    plate_number: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("users/profile/");
        setInfo({
          username: res.data.username || "",
          email: res.data.email || "",
          phone: res.data.phone_number || "",
          plate_number: res.data.plate_number || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile info", err);
      }
    };
    fetchProfile();
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const updateUsername = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("users/update-username/", { username: info.username });
      toast.success(" Username updated");
    } catch (err) {
      toast.error(err.response?.data?.detail || "❌ Failed to update username");
    }
  };

  const updateEmail = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("users/update-email/", { email: info.email });
      toast.success(" Email updated");
    } catch (err) {
      toast.error(err.response?.data?.detail || "❌ Failed to update email");
    }
  };

  const updatePhone = async (e) => {
    e.preventDefault();
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(info.phone)) {
      return toast.error("❌ Enter a valid phone number");
    }
    try {
      await axiosInstance.put("users/update-phone/", { phone: info.phone });
      toast.success(" Phone updated");
    } catch (err) {
      toast.error(err.response?.data?.detail || "❌ Failed to update phone");
    }
  };

  const updatePlate = async (e) => {
    e.preventDefault();
    const plateRegex = /^[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/;
    if (!plateRegex.test(info.plate_number)) {
      return toast.error("❌ Enter a valid plate number (e.g., 34ABC123)");
    }
    try {
      await axiosInstance.put("users/profile/", { plate_number: info.plate_number });
      toast.success(" Plate number updated");
    } catch (err) {
      toast.error("❌ Failed to update plate number");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("❌ Passwords do not match");
    }
    try {
      await axiosInstance.post("users/change-password/", {
        old_password: passwords.currentPassword,
        new_password: passwords.newPassword,
      });
      toast.success(" Password changed!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "❌ Failed to change password");
    }
  };

  return (
    <div className="settings-container" style={{
      maxWidth: 800,
      margin: "3rem auto",
      padding: "2rem",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#082742" }}>⚙️ Account Settings</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #ddd" }}>
        {[
          { id: 'info', label: '👤 Profile Info' },
          { id: 'security', label: '🔒 Security' }
        ].map((tabBtn) => (
          <button
            key={tabBtn.id}
            onClick={() => setTab(tabBtn.id)}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderBottom: tab === tabBtn.id ? "3px solid #082742" : "3px solid transparent",
              background: "none",
              fontSize: "1rem",
              fontWeight: tab === tabBtn.id ? 600 : 400,
              cursor: "pointer",
              color: tab === tabBtn.id ? "#082742" : "#555",
              transition: "0.3s",
            }}
          >
            {tabBtn.label}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <form onSubmit={updateUsername}>
            <label style={labelStyle}>Username</label>
            <input name="username" value={info.username} onChange={handleInfoChange} required style={inputStyle} />
            <button type="submit" style={primaryBtn}>Update Username</button>
          </form>

          <form onSubmit={updateEmail}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" value={info.email} onChange={handleInfoChange} required style={inputStyle} />
            <button type="submit" style={primaryBtn}>Update Email</button>
          </form>

          <form onSubmit={updatePhone}>
            <label style={labelStyle}>Phone Number</label>
            <input type="tel" name="phone" value={info.phone} onChange={handleInfoChange} required style={inputStyle} />
            <button type="submit" style={primaryBtn}>Update Phone</button>
          </form>

          <form onSubmit={updatePlate}>
            <label style={labelStyle}>Plate Number</label>
            <input name="plate_number" value={info.plate_number} onChange={handleInfoChange} placeholder="e.g. 34ABC123" style={inputStyle} />
            <button type="submit" style={primaryBtn}>Update Plate</button>
          </form>
        </div>
      )}

      {tab === "security" && (
        <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required style={inputStyle} />
          </div>
          <button type="submit" style={primaryBtn}>Change Password</button>
        </form>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  marginBottom: "1rem",
};

const primaryBtn = {
  backgroundColor: "#082742",
  color: "#fff",
  padding: "0.75rem 1.5rem",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1rem",
  border: "none",
  cursor: "pointer",
  transition: "0.3s",
};

const labelStyle = {
  fontWeight: "500",
  marginBottom: "0.5rem",
  display: "block",
};

export default Settings;
