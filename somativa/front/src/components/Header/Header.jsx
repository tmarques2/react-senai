// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

// 1. Importe o novo componente
// (Ajuste o caminho se sua pasta se chamar diferente)
import SearchBar from '../SearchBar/SearchBar'; 

import { FiHome, FiGrid, FiPlusSquare, FiLogIn } from 'react-icons/fi';
import logoImage from '../../assets/images/logo.png';

function Header() {
  
  // A lógica de scroll permanece aqui
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  const headerClassName = `headerNav ${isScrolled ? 'scrolled' : ''}`;

  // 2. Toda a lógica de busca (estados, efeitos, funções) foi REMOVIDA daqui

  return (
    <nav className={headerClassName}>
      
      <div className="navLeft">
        <Link to="/"> 
          <img 
            src={logoImage} 
            alt="THA3BOX Logo" 
            className="logo" 
          />
        </Link>
      </div>
      
      {/* 3. O navCenter agora apenas renderiza o componente SearchBar */}
      <div className="navCenter">
        <SearchBar />
      </div>
      
      <div className="navRight">
        
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}
        >
          <FiHome size={18} />
          <span>Início</span>
        </NavLink>
        
        <NavLink 
          to="/catalogo"
          className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}
        >
          <FiGrid size={18} />
          <span>Catálogo</span>
        </NavLink>
        
        <NavLink 
          to="/add-movie"
          className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}
        >
          <FiPlusSquare size={18} />
          <span>Adicionar Filme</span>
        </NavLink>
        
        <Link to="/login" className="loginButton">
          <FiLogIn size={18} />
          <span>Login</span>
        </Link>
      </div>

    </nav>
  );
}

export default Header;