import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.js";
import Login from "../src/views/auth/Login"; // Import your Login component
import ProtectedRoute from "views/auth/ProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Add the login route */}
      <Route path="/login" element={<Login />} />
      
      {/* Admin routes */}
      <Route path="/admin/*" element={<ProtectedRoute element={<AdminLayout />} />} />
      
      {/* Redirect to login if no routes match */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);
