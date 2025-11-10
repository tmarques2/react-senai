import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

// Este componente protege rotas SÓ PARA ADMINS
const AdminRoute = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    // Se não for admin, manda para a Home
    return <Navigate to="/" replace />;
  }

  // Se for admin, renderiza a rota
  return <Outlet />;
};

export default AdminRoute;