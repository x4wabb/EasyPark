import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const auth = isAuthenticated();
  console.log("ProtectedRoute check:", auth);
  return auth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
