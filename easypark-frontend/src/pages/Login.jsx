import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import "../styles/form.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", formData);

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refresh", refreshToken);

        // Fetch user profile to get plate_number
        const profileRes = await axiosInstance.get("users/profile/");
        const plateNum = profileRes.data.plate_number || "";
        localStorage.setItem("plate_number", plateNum);
        
        localStorage.setItem("ADMIN", true);


        toast.success("Login successful !");
        navigate("/home", { replace: true });
      } else {
        toast.error("Login failed. No access token.");
      }
    } catch (error) {
      toast.error("❌ Invalid username or password.");
    }
  };

  return (
    <div className="auth-container" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Panel */}
      <div
        className="auth-box"
        style={{
          flex: 1,
          backgroundColor: "#2874A6",
          padding: "4rem 2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
          Login to access your EasyPark account.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ padding: "0.8rem", borderRadius: "6px", marginBottom: "1rem", border: "none", width: "100%" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ padding: "0.8rem", borderRadius: "6px", marginBottom: "1.5rem", border: "none", width: "100%" }}
          />
          <button
            type="submit"
            style={{ backgroundColor: "#0e375f", color: "#fff", padding: "0.8rem", borderRadius: "6px", width: "100%", fontWeight: "bold" }}
          >
            Login
          </button>
        </form>
      </div>

      {/* Right Panel */}
      <div
        className="auth-side"
        style={{
          flex: 1,
          backgroundColor: "#f8f9fa",
          padding: "4rem 2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#333",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Don't have an account?</h2>
        <Link
          to="/register"
          style={{ fontSize: "1rem", color: "#0e375f", textDecoration: "underline", fontWeight: "600" }}
        >
          Register here
        </Link>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.95rem", color: "#666" }}>Are you an administrator?</p>
          <Link
            to="/admin-login"
            style={{
              fontWeight: "bold",
              color: "#0e375f",
              textDecoration: "underline",
              fontSize: "1rem",
            }}
          >
            Login as Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
