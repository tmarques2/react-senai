// src/components/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import './Footer.css';

// 1. Importe a imagem da logo (caminho ajustado)
import logoImage from '../../assets/images/logo.png'; 

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Ícones de Mídia Social */}
        <div className="footer-socials">
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook size={24} /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram size={24} /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter size={24} /></a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FiYoutube size={24} /></a>
        </div>

        {/* Links de Navegação do Footer */}
        <div className="footer-links">
          <div className="footer-column">
            <Link to="/">Sobre Nós</Link>
            <Link to="/">Carreiras</Link>
            <Link to="/">Imprensa</Link>
          </div>
          <div className="footer-column">
            <Link to="/">Termos de Uso</Link>
            <Link to="/">Privacidade</Link>
            <Link to="/">Avisos Legais</Link>
          </div>
          <div className="footer-column">
            <Link to="/">Central de Ajuda</Link>
            <Link to="/">Contato</Link>
            <Link to="/">Preferências</Link>
          </div>
        </div>

        {/* Marca e Copyright */}
        <div className="footer-brand">
          
          {/* 2. Troque o <h3> pela <img> dentro de um Link */}
          <Link to="/">
            <img src={logoImage} alt="THAIFLIX Logo" className="footer-logo-img" />
          </Link>

          <p className="footer-copyright">
            © 2025 THAIFLIX, Inc. Projeto fictício para fins de portfólio.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;