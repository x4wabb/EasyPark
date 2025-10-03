import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';

import 'leaflet/dist/leaflet.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ReservationHistory from './pages/ReservationHistory';
import ReservationSuccess from './pages/ReservationSuccess';
import FindSpot from './pages/FindSpot';
import PlateRecognition from './pages/PlateRecognition';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin'; // ✅ NEW
import Success from './pages/Success';
import Cancel from './pages/Cancel';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Shared layout with navbar */}
        <Route element={<App />}>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><ReservationHistory /></ProtectedRoute>} />
          <Route path="/find" element={<ProtectedRoute><FindSpot /></ProtectedRoute>} />
          <Route path="/plate" element={<ProtectedRoute><PlateRecognition /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Route>

        {/* Post-payment reservation confirmation */}
        <Route path="/reservation-success" element={<ProtectedRoute><ReservationSuccess /></ProtectedRoute>} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {/* ✅ NEW admin login route */}
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={900}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  </React.StrictMode>
);
