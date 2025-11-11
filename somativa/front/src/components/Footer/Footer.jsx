// src/components/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import './Footer.css';

import logoImage from '../../assets/images/logo.png'; 

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Ícones de Mídia Social (Mantidos) */}
        <div className="footer-socials">
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook size={24} /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram size={24} /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter size={24} /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FiYoutube size={24} /></a>
        </div>

        {/* --- ÁREA DE LINKS MODIFICADA --- */}
        <div className="footer-links">
          {/* Removemos as colunas e o link "Contato" */}
          <Link to="/sobre-nos">Sobre Nós</Link>
        </div>
        {/* --- FIM DA MODIFICAÇÃO --- */}

        {/* Marca e Copyright (Mantidos) */}
        <div className="footer-brand"> 
          <Link to="/">
            <img src={logoImage} alt="THAIFLIX Logo" className="footer-logo-img" />
          </Link>

          <p className="footer-copyright">
            © 2025 THAIFLIX, Todos os direitos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;