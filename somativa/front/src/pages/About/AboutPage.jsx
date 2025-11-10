import React, { useState, useEffect } from 'react';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import './AboutPage.css';

// --- MUDANÇA AQUI ---
// Trocámos o 'SiJwt' por 'FaKey' (ícone de chave)
import { FaReact, FaPython, FaKey } from 'react-icons/fa'; 
import { DiMysql } from 'react-icons/di';
// --- FIM DA MUDANÇA ---


function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="about-container">
      <h2>Sobre o THAIFLIX</h2>

      <section className="about-section">
        <h3>O Projeto</h3>
        <p>
          O **THAIFLIX** é um projeto fictício full-stack criado como parte do meu portfólio de desenvolvimento. A plataforma é uma aplicação web completa (clone da Netflix) que permite aos utilizadores navegar, pesquisar, adicionar e gerir um catálogo de filmes.
        </p>
        <p>
          O principal objetivo deste projeto é demonstrar competências práticas na criação de um backend em Python puro, gestão de uma base de dados MySQL, e a construção de um frontend moderno e reativo com React, incluindo autenticação de utilizadores e diferentes níveis de permissão.
        </p>
      </section>

      <section className="about-section">
        <h3>Funcionalidades Principais</h3>
        <ul>
          <li><strong>Autenticação de Utilizadores:</strong> Sistema de login seguro com tokens (JWT).</li>
          <li><strong>Dois Níveis de Acesso:</strong>
            <ul>
              <li>**Utilizador Comum:** Pode navegar, pesquisar e enviar sugestões de novos filmes.</li>
              <li>**Administrador:** Pode aprovar/rejeitar sugestões, editar e excluir filmes existentes.</li>
            </ul>
          </li>
          <li><strong>Sistema de Notificações:</strong> O admin recebe notificações em tempo real (polling) sobre novos pedidos.</li>
          <li><strong>Gestão de Filmes (CRUD):</strong> Funcionalidade completa para Criar, Ler, Atualizar e Deletar filmes.</li>
          <li><strong>Pesquisa Dinâmica:</strong> Barra de pesquisa no Header que filtra o catálogo.</li>
        </ul>
      </section>
      
      <section className="about-section">
        <h3>Tecnologias Utilizadas</h3>
        <div className="tech-grid">
          <div className="tech-item">
            <FaReact color="#61DAFB" />
            <strong>React.js</strong>
            <span>Frontend reativo, Hooks (useState, useEffect, useContext) e React Router.</span>
          </div>
          <div className="tech-item">
            <FaPython color="#3776AB" />
            <strong>Python (Puro)</strong>
            <span>Backend construído com a biblioteca `http.server`, gerindo rotas e lógica de negócio.</span>
          </div>
          <div className="tech-item">
            <DiMysql color="#4479A1" />
            <strong>MySQL</strong>
            <span>Base de dados relacional para armazenar utilizadores, filmes e relações.</span>
          </div>
          <div className="tech-item">
            {/* --- MUDANÇA AQUI --- */}
            <FaKey color="#d63aff" />
            <strong>JWT (JSON Web Tokens)</strong>
            <span>Para autenticação e proteção de rotas de API.</span>
            {/* --- FIM DA MUDANÇA --- */}
          </div>
        </div>
      </section>

      <section className="about-section">
        <h3>Sobre a Criadora</h3>
        <p>
          Olá! O meu nome é **Thaís** [Seu Sobrenome], e sou a desenvolvedora por trás deste projeto. Sou apaixonada por criar soluções web robustas e intuitivas, desde o servidor até ao último pixel no ecrã.
        </p>
        <div className="contact-links">
          <a href="https://github.com/seu-usuario" target="_blank" rel="noopener noreferrer">
            Ver no GitHub
          </a>
          <a href="https://linkedin.com/in/seu-usuario" target="_blank" rel="noopener noreferrer">
            Meu LinkedIn
          </a>
        </div>
      </section>

    </div>
  );
}

export default AboutPage;