import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Ensure the path matches your project structure

const PrivateRoute = () => {
  const { currentUser } = useAuth();  // Check if a user is logged in

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;