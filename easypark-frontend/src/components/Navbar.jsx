import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/reservations">My Reservations</Link>

      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
