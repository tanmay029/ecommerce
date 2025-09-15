import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo) {
    // Redirect to login page with return url
    return <Navigate to={`/login?redirect=${location.pathname}`} state={{ from: location }} replace />;
  }

  if (adminOnly && !userInfo.isAdmin) {
    // Redirect to home if user is not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;