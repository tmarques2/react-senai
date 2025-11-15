import React, { useState, useEffect } from 'react';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import './AboutPage.css';

import { FiMonitor, FiSmartphone, FiDownload, FiCheckCircle } from 'react-icons/fi';

const FeatureItem = ({ icon, title, text }) => (
  <div className="feature-item">
    <div className="feature-icon">
      {icon}
    </div>
    <div className="feature-text">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  </div>
);

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

  // Estilo inline para o CTA (para facilitar a adição da sua imagem)
  const ctaStyle = {
    // backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${ctaBackground})`
  };

  return (
    <div className="about-page">

      {/* --- Seção Hero (Título) --- */}
      <section className="about-hero">
        <div className="hero-content">
          <h2>Sobre o THAIFLIX</h2>
          <p>Sua casa para o melhor do cinema mundial, onde você estiver.</p>
        </div>
      </section>

      {/* --- Wrapper do Conteúdo --- */}
      <div className="about-content-wrapper">

        {/* --- SEÇÃO 1: NOSSA MISSÃO (Layout 2 Colunas) --- */}
        <section className="about-section-grid">
          
          {/* Coluna de Imagem */}
          <div className="about-grid-col image-col">
            <img 
                src="https://thumbs.dreamstime.com/b/fam%C3%ADlia-assistindo-tv-%C3%A0-noite-em-casa-feliz-passando-tempo-juntos-m%C3%A3e-pai-e-crian%C3%A7as-filmes-de-com-pipoca-366701855.jpg" 
                alt="Família assistindo filme em casa" 
              />
          </div>
          
          {/* Coluna de Texto (Nossa Missão) */}
          <div className="about-grid-col text-col">
            <h3>Nossa Missão</h3>
            <p>
              No THAIFLIX, somos apaixonados por contar histórias. Acreditamos que os filmes são mais do que entretenimento; eles são pontes para novas culturas, ideias e emoções.
            </p>
            <p>
              Nossa missão é simples: criar a plataforma de streaming mais envolvente e acessível do mundo, oferecendo um catálogo curado com os melhores filmes, dos clássicos atemporais aos sucessos de bilheteria mais recentes.
            </p>
          </div>

        </section>

        {/* --- SEÇÃO 2: VANTAGENS E NÚMEROS (Layout 2 Colunas) --- */}
        <section className="about-section-grid reverse">
          
          {/* Coluna de Estatísticas (em linha) */}
          <div className="about-grid-col text-col">
            <h3>O THAIFLIX em Números</h3>
            <p>Estamos crescendo rapidamente, graças a uma comunidade que, como nós, ama filmes.</p>
            
            <div className="stats-inline-container">
              <div className="stat-inline-item">
                <h2>20 Mil+</h2>
                <span>Títulos no Catálogo</span>
              </div>
              <div className="stat-inline-item">
                <h2>10 Milhões</h2>
                <span>Membros Ativos</span>
              </div>
              <div className="stat-inline-item">
                <h2>99.9%</h2>
                <span>Uptime da Plataforma</span>
              </div>
              <div className="stat-inline-item">
                <h2>4K</h2>
                <span>Qualidade de Imagem</span>
              </div>
            </div>
          </div>
          
          {/* Coluna de Vantagens (Lista de Features) */}
          <div className="about-grid-col text-col">
            <h3>Nossas Vantagens</h3>
            <div className="features-container">
              <FeatureItem 
                icon={<FiMonitor />} 
                title="Assista em Qualquer Lugar" 
                text="Disponível na sua TV, computador, tablet ou smartphone."
              />
              <FeatureItem 
                icon={<FiDownload />} 
                title="Modo Offline" 
                text="Baixe seus filmes favoritos para assistir sem conexão com a internet."
              />
              <FeatureItem 
                icon={<FiCheckCircle />} 
                title="Sem Compromisso" 
                text="Cancele a qualquer momento, sem taxas ou multas."
              />
            </div>
          </div>

        </section>

        {/* --- SEÇÃO 3: CTA (Call to Action) --- */}
        <section className="about-section-cta" style={ctaStyle}>
          <div className="cta-content">
            <h3>Pronto para assistir?</h3>
            <p>
              Junte-se a milhões de amantes de cinema. Assine o THAIFLIX hoje mesmo.
            </p>
            <div className="contact-links">
              {/* O link aponta para a página de Login/Registro */}
              <a href="/login">
                Assine Agora
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default AboutPage;