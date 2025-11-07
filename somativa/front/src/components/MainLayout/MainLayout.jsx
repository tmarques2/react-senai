// src/components/MainLayout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header'; // Caminho para o seu header

function MainLayout() {
  return (
    <>
      <Header />
      
      {/* O <Outlet /> é onde as páginas (Home, Catálogo) 
          serão renderizadas */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;