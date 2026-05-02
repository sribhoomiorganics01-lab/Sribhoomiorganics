import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Allow ALL logged-in users
  return children;
};

export default PrivateRoute;