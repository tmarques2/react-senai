import React from 'react';
import { Search } from 'react-feather';
import './Header.css';

import logoImage from '../../assets/images/thabox.svg'; // <-- Caminho atualizado

function Header() {
  return (
    <nav className="headerNav">
      
      {/* 2. SEÇÃO ESQUERDA (Logo) */}
      <div className="navLeft">
        {/* SUBSTITUA O <span> POR ESTA <img> */}
        <img 
          src={logoImage} 
          alt="THA3BOX Logo" 
          className="logo" 
        />
      </div>
      
      {/* 3. SEÇÃO CENTRAL (Busca) */}
      <div className="navCenter">
        <div className="searchBar">
          <Search color="#fff" size={20} className="searchIcon" />
          <input type="text" placeholder="Buscar filmes" className="searchInput" />
        </div>
      </div>
      
      {/* 4. SEÇÃO DIREITA (Links e Login) */}
      <div className="navRight">
        <a href="#home" className="navLink active">Início</a>
        <a href="#catalog" className="navLink">Catálogo</a>
        <button className="loginButton">Login</button>
      </div>

    </nav>
  );
}

export default Header;