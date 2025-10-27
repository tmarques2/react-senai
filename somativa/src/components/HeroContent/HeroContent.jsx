import React from 'react';
import MovieInfo from '../MovieInfo/MovieInfo.jsx';
import MovieSelector from '../MovieSelector/MovieSelector.jsx';
import './HeroContent.css';

// Este componente recebe todos os dados e os distribui
// para os componentes de Info e Seleção
function HeroContent({ movies, activeIndex, onSelect }) {
  
  const activeMovie = movies[activeIndex];

  return (
    <div className="heroContentContainer">
      
      {/* Coluna da Esquerda: Informações */}
      <div className="heroInfoColumn">
        <MovieInfo 
          key={activeMovie.id} // A key ainda é vital para a animação
          movie={activeMovie} 
          activeIndex={activeIndex} 
        />
      </div>

      {/* Coluna da Direita: Pôsteres */}
      <div className="heroSelectorColumn">
        <MovieSelector 
          movies={movies} 
          activeIndex={activeIndex} 
          onSelect={onSelect} 
        />
      </div>

    </div>
  );
}

export default HeroContent;