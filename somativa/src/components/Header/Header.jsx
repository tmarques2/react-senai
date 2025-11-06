// src/components/Header/Header.jsx (CORRIGIDO)
import React, { useState, useEffect } from 'react';
import { Search } from 'react-feather';
import { NavLink, Link } from 'react-router-dom'; // O 'Link' já está aqui
import './Header.css';

import { FiHome, FiGrid, FiPlusSquare, FiLogIn } from 'react-icons/fi';
import logoImage from '../../assets/images/logo.png';

function Header() {
  
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

  return (
    <nav className={headerClassName}>
      
      {/* --- ESTA É A CORREÇÃO --- */}
      <div className="navLeft">
        {/* Envolvemos a imagem do logo com o Link apontando para "/" */}
        <Link to="/"> 
          <img 
            src={logoImage} 
            alt="THA3BOX Logo" 
            className="logo" 
          />
        </Link>
      </div>
      {/* --- FIM DA CORREÇÃO --- */}
      
      <div className="navCenter">
        <div className="searchBar">
          <Search color="#fff" size={20} className="searchIcon" />
          <input type="text" placeholder="Buscar filmes" className="searchInput" />
        </div>
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