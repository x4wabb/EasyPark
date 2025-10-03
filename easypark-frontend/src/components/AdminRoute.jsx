import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("users/profile/")
      .then((res) => {
        const admin = res.data.is_staff;
        setIsAdmin(admin);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to check admin status:", err);
        setIsAdmin(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontFamily: "Poppins, sans-serif" }}>
        <h3>Checking admin access...</h3>
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/home" />;
};

export default AdminRoute;
