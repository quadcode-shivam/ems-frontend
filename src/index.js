import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.js";
import Login from "views/auth/Login.jsx";
import Register from "views/auth/Register.jsx";
import ForgotPassword from "views/auth/ForgotPassword.jsx";
import Dashboards from "views/Dashboards.js";
import ProtectedRoute from './ProtectedRoute';  // Import the ProtectedRoute component

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Protect the admin and dashboard routes */}
      <Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
      <Route path="/admin/dashboards" element={<ProtectedRoute><Dashboards /></ProtectedRoute>} />

      {/* Auth routes (do not require authentication) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Redirect unknown routes to dashboards if authenticated */}
      <Route path="*" element={<Navigate to="/admin/dashboards" replace />} />
    </Routes>
  </BrowserRouter>
);
