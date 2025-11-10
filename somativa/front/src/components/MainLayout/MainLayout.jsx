// src/components/MainLayout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import './MainLayout.css'; // <-- O import já está aqui, ótimo!

function MainLayout() {
  return (
    // 1. Adicione a classe "wrapper" principal aqui
    <div className="main-layout-wrapper">
      
      <Header />
      
      {/* 2. Adicione a classe de "conteúdo" na tag <main> */}
      <main className="main-layout-content">
        <Outlet /> {/* As suas páginas são renderizadas aqui */}
      </main>
      
      <Footer /> {/* O footer será empurrado para o fundo */}
    
    </div>
  );
}

export default MainLayout;