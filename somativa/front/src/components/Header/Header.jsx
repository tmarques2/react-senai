// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import './Header.css';

import SearchBar from '../SearchBar/SearchBar'; 

// 2. Importar os ícones necessários e o useAuth
import { FiHome, FiGrid, FiPlusSquare, FiLogIn, FiLogOut, FiShield } from 'react-icons/fi';
import logoImage from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext'; // 3. Importar useAuth

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 4. Pegar dados do usuário e funções de auth
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  // 5. Criar função de Logout
  const handleLogout = () => {
    logout();
    navigate('/'); // Volta para home após o logout
  };

  const headerClassName = `headerNav ${isScrolled ? 'scrolled' : ''}`;

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
      
      <div className="navCenter">
        <SearchBar />
      </div>
      
      {/* 6. --- LÓGICA DO NAV-RIGHT ATUALIZADA --- */}
      <div className="navRight">
        
        {/* Mostra o ícone de status (Admin/Usuário) */}
        {user && (
          <div className={`userIndicator ${isAdmin() ? 'admin' : 'user'}`}>
            {isAdmin() ? (
              <>
                <FiShield size={18} />
                <span>Admin</span>
              </>
            ) : (
              <>
                👤
                <span>Usuário</span>
              </>
            )}
          </div>
        )}

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
        
        {/* Mostra "Adicionar Filme" APENAS se estiver logado */}
        {user && (
          <NavLink 
            to="/add-movie"
            className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}
          >
            <FiPlusSquare size={18} />
            <span>Adicionar Filme</span>
          </NavLink>
        )}

        {/* Mostra "Dashboard" APENAS se for admin */}
        {isAdmin() && (
          <NavLink 
            to="/admin/dashboard"
            className={({ isActive }) => isActive ? 'navLink active adminDashboardLink' : 'navLink adminDashboardLink'}
          >
            <FiShield size={18} />
            <span>Dashboard</span>
          </NavLink>
        )}
        
        {/* Mostra "Login" OU "Logout" */}
        {user ? (
          <button onClick={handleLogout} className="logoutButton">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        ) : (
          <Link to="/login" className="loginButton">
            <FiLogIn size={18} />
            <span>Login</span>
          </Link>
        )}

      </div>
    </nav>
  );
}

export default Header;