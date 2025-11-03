// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react'; // 1. Importe os hooks
import { Search } from 'react-feather';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

import { FiHome, FiGrid, FiPlusSquare, FiLogIn } from 'react-icons/fi';
import logoImage from '../../assets/images/logo.png';

function Header() {
  
  // 2. Crie um estado para 'escutar' a rolagem
  const [isScrolled, setIsScrolled] = useState(false);

  // 3. Adicione o 'escutador' de evento
  useEffect(() => {
    const handleScroll = () => {
      // Se o usuário rolar mais que 10 pixels, ative o estado
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Adiciona o 'escutador' quando o componente é montado
    window.addEventListener('scroll', handleScroll);

    // Remove o 'escutador' quando o componente é 'desmontado'
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // O array vazio [] faz isso rodar só uma vez

  // 4. Crie a classe dinâmica
  const headerClassName = `headerNav ${isScrolled ? 'scrolled' : ''}`;

  return (
    // 5. Aplique a classe dinâmica na 'nav'
    <nav className={headerClassName}>
      
      <div className="navLeft">
        <img 
          src={logoImage} 
          alt="THA3BOX Logo" 
          className="logo" 
        />
      </div>
      
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