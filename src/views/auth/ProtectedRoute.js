import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // Check if the token and user data exist
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
