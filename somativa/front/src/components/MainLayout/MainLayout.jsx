// src/components/MainLayout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header'; 
// 1. Importe o Footer
import Footer from '../Footer/Footer'; 

function MainLayout() {
  return (
    <>
      <Header />
      
      {/* O <Outlet /> renderiza suas páginas */}
      <main>
        <Outlet />
      </main>
      
      {/* 2. Adicione o Footer aqui */}
      <Footer />
    </>
  );
}

export default MainLayout;