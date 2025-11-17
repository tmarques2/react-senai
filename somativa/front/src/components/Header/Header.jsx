// src/components/Header/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './Header.css';

import SearchBar from '../SearchBar/SearchBar';
import { FiHome, FiGrid, FiPlusSquare, FiLogIn, FiLogOut, FiShield, FiBell } from 'react-icons/fi';
import logoImage from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, isAdmin, logout, pendingCount } = useAuth();
  const navigate = useNavigate();

  // --- Estados e Refs para os Dropdowns ---
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // NOVO
  
  const notificationRef = useRef(null);
  const adminDropdownRef = useRef(null);
  const userDropdownRef = useRef(null); // NOVO

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  // Efeito para fechar os dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setIsAdminDropdownOpen(false);
      }
      // NOVO: Fecha o dropdown do usuário
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef, adminDropdownRef, userDropdownRef]); // ALTERADO

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  // --- Funções de Toggle dos Dropdowns ---
  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(prev => !prev);
    setIsAdminDropdownOpen(false);
    setIsUserDropdownOpen(false); // ALTERADO
  };
  
  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(prev => !prev);
    setIsNotificationDropdownOpen(false);
    setIsUserDropdownOpen(false); // ALTERADO
  };

  // NOVO: Toggle para o dropdown do usuário
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(prev => !prev);
    setIsAdminDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  // Função para o clique no item de notificação (SINO)
  const handleDropdownClick = () => {
    setIsNotificationDropdownOpen(false);
    navigate('/admin/dashboard');
  };

  // Função para o botão Sair do menu Admin
  const handleAdminLogout = () => {
    setIsAdminDropdownOpen(false);
    handleLogout();
  };

  // NOVO: Função para o botão Sair do menu Usuário
  const handleUserLogout = () => {
    setIsUserDropdownOpen(false);
    handleLogout();
  };

  const headerClassName = `headerNav ${isScrolled ? 'scrolled' : ''}`;

  return (
    <nav className={headerClassName}>
      
      <div className="navLeft">
        <Link to="/"> 
          <img src={logoImage} alt="THAIFLIX Logo" className="logo" />
        </Link>
      </div>
      
      <div className="navCenter">
        <SearchBar />
      </div>
      
      {/* --- navRight --- */}
      <div className="navRight">
        
        {/* 1. LINKS DE NAVEGAÇÃO (Padrão) */}
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
        
        {/* 2. BLOCO DE AUTENTICAÇÃO */}
        {user ? (
          <>
            {/* O Sino (só para Admin) */}
            {isAdmin() && (
              <div className="notificationContainer" ref={notificationRef}>
                <button className="notificationBell" onClick={toggleNotificationDropdown}>
                  <FiBell size={20} />
                  {pendingCount > 0 && (
                    <span className="notificationBadge">{pendingCount}</span>
                  )}
                </button>
                {/* LÓGICA DO SINO RESTAURADA (para corrigir o erro) */}
                {isNotificationDropdownOpen && (
                  <div className="notificationDropdown">
                    {pendingCount > 0 ? (
                      <div className="notificationItem" onMouseDown={handleDropdownClick}>
                        Você tem {pendingCount} {pendingCount === 1 ? 'pedido pendente' : 'pedidos pendentes'}.
                      </div>
                    ) : (
                      <div className="notificationItem no-pending">
                        Nenhuma notificação no momento.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* O Indicador (Admin com dropdown OU Utilizador com dropdown) */}
            
            {isAdmin() ? (
              // Container do Dropdown Admin
              <div className="adminDropdownContainer" ref={adminDropdownRef}>
                <button 
                  className={`userIndicator admin ${isAdminDropdownOpen ? 'active' : ''}`} 
                  onClick={toggleAdminDropdown}
                >
                  <FiShield size={18} />
                  <span>Admin</span>
                </button>
                
                {isAdminDropdownOpen && (
                  <div className="adminDropdown">
                    <NavLink 
                      to="/add-movie" 
                      className="adminDropdownLink"
                      onClick={() => setIsAdminDropdownOpen(false)}
                    >
                      <FiPlusSquare size={16} />
                      <span>Adicionar Filme</span>
                    </NavLink>
                    <NavLink 
                      to="/admin/dashboard" 
                      className="adminDropdownLink"
                      onClick={() => setIsAdminDropdownOpen(false)}
                    >
                      <FiShield size={16} /> 
                      <span>Dashboard</span>
                    </NavLink>
                    <button 
                      onClick={handleAdminLogout} 
                      className="adminDropdownLink adminDropdownLogout"
                    >
                      <FiLogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Container do Dropdown de Usuário
              <div className="adminDropdownContainer" ref={userDropdownRef}>
                <button 
                  className={`userIndicator user ${isUserDropdownOpen ? 'active' : ''}`}
                  onClick={toggleUserDropdown}
                >
                  👤
                  <span>Usuário</span>
                </button>
                
                {isUserDropdownOpen && (
                  <div className="adminDropdown">
                    <NavLink 
                      to="/add-movie" 
                      className="adminDropdownLink"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FiPlusSquare size={16} />
                      <span>Adicionar Filme</span>
                    </NavLink>
                    
                    <button 
                      onClick={handleUserLogout} 
                      className="adminDropdownLink adminDropdownLogout"
                    >
                      <FiLogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Se estiver deslogado, mostra apenas o Login */
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