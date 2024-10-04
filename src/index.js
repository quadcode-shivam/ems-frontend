import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import context from 'context'; // Fix or remove this import.

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.js";
import Login from "views/auth/Login.jsx";  // Import the Login component
import Register from "views/auth/Register.jsx";  // Import the Register component
import ForgotPassword from "views/auth/ForgotPassword.jsx";  // Import the Forgot Password component
import Dashboards from "views/Dashboards.js"; // Import the Dashboard component

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Admin Layout for dashboard and other admin-related routes */}
      <Route path="/admin/*" element={<AdminLayout />} />

      {/* Separate routes outside the admin layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New route for Forgot Password */}

      {/* Example dashboard route within Admin Layout */}
      <Route path="/admin/dashboard" element={<Dashboards />} />

      {/* Redirect all unknown paths to admin dashboard */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);
