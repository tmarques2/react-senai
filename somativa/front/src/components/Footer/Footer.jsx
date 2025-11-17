import React from 'react';
import { Link } from 'react-router-dom';

// 1. Ícones corretos do react-icons
import { FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi'; 

// 2. Importação do seu CSS
import './Footer.css';

// 3. Importação da sua logo (como solicitado)
import logoImage from '../../assets/images/logo.png'; 

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* --- ESTRUTURA PRINCIPAL (Layout da Foto) --- */}
        <div className="footer-main">

          {/* Colunas de Navegação (Links e Siga-nos) */}
          <div className="footer-nav-cols">
            
            {/* Coluna 1: Links (ATUALIZADO) */}
            <div className="footer-column">
              <h4>Links:</h4>
              <Link to="/">Inicio</Link>
              <Link to="/sobre-nos">Sobre Nós</Link>
              <Link to="/catalogo">Catalogo</Link>
            </div>

            {/* Coluna 2: Siga-nos (ATUALIZADO) */}
            <div className="footer-column footer-social-col">
              <h4>Siga-nos:</h4>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FiInstagram size={20} />
                Instagram
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FiLinkedin size={20} />
                Linkedin
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FiGithub size={20} />
                Github
              </a>
            </div>
          </div>

          {/* Logo no canto direito */}
          <div className="footer-brand-logo">
            <Link to="/">
              {/* Imagem da logo importada */}
              <img src={logoImage} alt="THAIFLIX Logo" className="footer-logo-img" />
            </Link>
          </div>
        </div>

        {/* --- SEPARADOR E COPYRIGHT (Layout da Foto) --- */}

        {/* Linha separadora */}
        <div className="footer-separator"></div>

        {/* Copyright centralizado abaixo */}
        <div className="footer-copyright-bottom">
          <p>
            © 2025 THAIFLIX, Todos os direitos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;