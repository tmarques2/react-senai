import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Este componente protege rotas que exigem QUALQUER utilizador logado.
 * Se o utilizador não estiver logado, é redirecionado para a página /login.
 */
const ProtectedRoute = () => {
  // O 'user' vem do nosso AuthContext
  const { user } = useAuth();

  if (!user) {
    // Não há utilizador logado? Manda-o para a página de login.
    // 'replace' substitui a entrada no histórico de navegação.
    return <Navigate to="/login" replace />;
  }

  // Há um utilizador logado? Ótimo.
  // <Outlet /> renderiza o componente da rota que está a ser protegida
  // (neste caso, o <AddMoviePage />).
  return <Outlet />;
};

export default ProtectedRoute;