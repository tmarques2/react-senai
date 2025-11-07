import React, { useState, useEffect } from 'react';
 
import MovieBackground from '../../components/MovieBackground/MovieBackground.jsx';
import HeroContent from '../../components/HeroContent/HeroContent.jsx';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';

import './Home.css';
import MovieRow from '../../components/MovieRow/MovieRow.jsx';

import { movieData, featuredData } from '../../data/movieData.js';

function HomePage() {
  // O estado do Hero (para o carrossel principal)
  const [heroMovies, setHeroMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // O estado da fileira "Destaques"
  const [featuredMovies, setFeaturedMovies] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulação de carregamento (agora carrega AMBOS os dados)
  useEffect(() => {
    new Promise((resolve) => {
      setTimeout(() => {
        // Em um app real, você faria duas chamadas de API
        resolve({ hero: movieData, featured: featuredData });
      }, 500); 
    })
    .then((data) => {
      setHeroMovies(data.hero);
      setFeaturedMovies(data.featured);
    })
    .catch((err) => setError(err.message))
    .finally(() => setIsLoading(false));
  }, []);

  const handleMovieSelect = (index) => {
    setActiveIndex(index);
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="loadingScreen">Erro: {error}</div>;
  if (heroMovies.length === 0) return <div className="loadingScreen">Nenhum filme encontrado.</div>;

  return (
    // 3. Renomeie o container para 'homePage'
    <div className="homePage">
      
      {/* --- Seção Hero (O que já fizemos) --- */}
      <div className="showcaseContainer">
        <MovieBackground movies={heroMovies} activeIndex={activeIndex} />
        <HeroContent 
          movies={heroMovies}
          activeIndex={activeIndex}
          onSelect={handleMovieSelect}
        />
      </div>

      {/* --- SEÇÃO DESTAQUES (NOVA) --- */}
      <MovieRow 
        title="Destaques" 
        movies={featuredMovies} 
      />

      {/* Você pode adicionar mais fileiras aqui facilmente */}
      {/* <MovieRow title="Comédia" movies={featuredMovies} /> */}
      {/* <MovieRow title="Ação" movies={featuredMovies} /> */}

    </div>
  );
}

export default HomePage;