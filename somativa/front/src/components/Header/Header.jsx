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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const notificationRef = useRef(null); // Ref para o dropdown

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  // Efeito para fechar o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Fecha o menu
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(false); // Fecha o menu
    navigate('/admin/dashboard'); // Navega para o dashboard
  };

  const headerClassName = `headerNav ${isScrolled ? 'scrolled' : ''}`;

  return (
    <nav className={headerClassName}>
      
      <div className="navLeft">
        <Link to="/"> 
          <img 
            src={logoImage} 
            alt="THAIFLIX Logo" 
            className="logo" 
          />
        </Link>
      </div>
      
      <div className="navCenter">
        <SearchBar />
      </div>
      
      {/* --- navRight REORDENADO --- */}
      <div className="navRight">
        
        {/* --- 1. LINKS DE NAVEGAÇÃO --- */}
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
        
        {user && (
          <NavLink 
            to="/add-movie"
            className={({ isActive }) => isActive ? 'navLink active' : 'navLink'}
          >
            <FiPlusSquare size={18} />
            <span>Adicionar Filme</span>
          </NavLink>
        )}

        {isAdmin() && (
          <NavLink 
            to="/admin/dashboard"
            className={({ isActive }) => isActive ? 'navLink active adminDashboardLink' : 'navLink adminDashboardLink'}
          >
            <FiShield size={18} />
            <span>Dashboard</span>
          </NavLink>
        )}
        
        {/* --- 2. BLOCO DE AUTENTICAÇÃO --- */}

        {/* Se o utilizador estiver logado */}
        {user ? (
          <>
            {/* O Sino (só para Admin) - VEM PRIMEIRO */}
            {isAdmin() && (
              <div className="notificationContainer" ref={notificationRef}>
                <button className="notificationBell" onClick={toggleDropdown}>
                  <FiBell size={20} />
                  {pendingCount > 0 && (
                    <span className="notificationBadge">{pendingCount}</span>
                  )}
                </button>
                {isDropdownOpen && (
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

            {/* O Indicador (Admin ou Utilizador) - VEM A SEGUIR */}
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

            {/* O botão de Logout - VEM POR ÚLTIMO */}
            <button onClick={handleLogout} className="logoutButton">
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
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