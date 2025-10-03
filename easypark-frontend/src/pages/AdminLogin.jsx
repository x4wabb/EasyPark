import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/form.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/login/", formData);
      const { access, refresh } = res.data;

      if (access) {
        localStorage.setItem("token", access);
        localStorage.setItem("refresh", refresh);
        axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

        const profile = await axios.get("http://127.0.0.1:8000/api/users/profile/", {
          headers: { Authorization: `Bearer ${access}` },
        });

        if (profile.data.is_staff) {
                    navigate("/admin");
        } else {
          toast.error(" You are not an admin.");
        }
      }
    } catch (err) {
      toast.error("Login failed. Invalid credentials.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Admin Access</h1>
        <p className="auth-subtitle">Only for authorized personnel.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Admin Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Admin Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login as Admin</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
