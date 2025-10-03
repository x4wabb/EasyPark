import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/form.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    date_of_birth: "",
    is_special: false,
    plate_number: "",
  });

  const [plateError, setPlateError] = useState("");

  // Regex for Turkish plates: 2 digits + 1-3 letters + 1-4 digits
  const plateRegex = /^[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "plate_number") {
      const cleanValue = value.toUpperCase().replace(/[^0-9A-Z]/g, "");
      setFormData((prev) => ({ ...prev, plate_number: cleanValue }));

      if (cleanValue && !plateRegex.test(cleanValue)) {
        setPlateError("Invalid Turkish plate number format (e.g. 34ABC123)");
      } else {
        setPlateError("");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (plateError) {
      toast.error("Please fix plate number before submitting.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/users/register/", formData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        const firstKey = Object.keys(errors)[0];
        const message = Array.isArray(errors[firstKey])
          ? errors[firstKey][0]
          : errors[firstKey];
        toast.error(message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>EasyPark</h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          Welcome to the easiest and most secure car parking platform.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="plate_number"
            placeholder="License Plate Number"
            value={formData.plate_number}
            onChange={handleChange}
            maxLength={8}
            required
            style={{ textTransform: "uppercase" }}
          />
          {plateError && (
            <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0" }}>
              {plateError}
            </p>
          )}

          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              name="is_special"
              checked={formData.is_special}
              onChange={handleChange}
            />
            <span>Special Needs?</span>
          </label>

          <button type="submit">Register</button>
        </form>
      </div>

      <div className="auth-side">
        <h2>Already have an account?</h2>
        <Link
          to="/login"
          style={{
            color: "#0e375f",
            fontWeight: "600",
            textDecoration: "underline",
            marginTop: "0.5rem",
          }}
        >
          Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;
