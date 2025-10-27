// src/components/MovieSelector.jsx

import React from 'react';
// Precisamos dos ícones de seta
import { ChevronLeft, ChevronRight } from 'react-feather';
import './MovieSelector.css';

function MovieSelector({ movies, activeIndex, onSelect }) {

  const handlePrev = () => {
    // Se estiver no primeiro, vai para o último
    const newIndex = activeIndex === 0 ? movies.length - 1 : activeIndex - 1;
    onSelect(newIndex);
  };

  const handleNext = () => {
    // Se estiver no último, vai para o primeiro
    const newIndex = activeIndex === movies.length - 1 ? 0 : activeIndex + 1;
    onSelect(newIndex);
  };

  return (
    // A classe 'movieSelector' não precisa mais de 'position: absolute'
    <div className="movieSelector">
      
      {/* Lista de Pôsteres */}
      <div className="posterList">
        {movies.map((movie, index) => (
          <img
            key={movie.id}
            src={movie.posterUrl}
            alt={movie.title}
            className={`posterImg ${index === activeIndex ? 'active' : ''}`}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>

      {/* Setas do Carrossel (NOVAS) */}
      <div className="carouselArrows">
        <button className="arrowButton" onClick={handlePrev}>
          <ChevronLeft size={20} color="white" />
        </button>
        <button className="arrowButton" onClick={handleNext}>
          <ChevronRight size={20} color="white" />
        </button>
      </div>
    </div>
  );
}

export default MovieSelector;