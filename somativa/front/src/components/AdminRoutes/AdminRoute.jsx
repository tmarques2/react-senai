import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;