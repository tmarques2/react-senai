// src/components/MovieSelector.jsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import './MovieSelector.css';

function MovieSelector({ movies, activeIndex, onSelect }) {

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? movies.length - 1 : activeIndex - 1;
    onSelect(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === movies.length - 1 ? 0 : activeIndex + 1;
    onSelect(newIndex);
  };

  // --- LÓGICA DO CARROSSEL CENTRALIZADO ---
  
  // Define as larguras (devem ser as mesmas do CSS)
  const posterWidth = 120;
  const gap = 15;
  const itemWidthWithGap = posterWidth + gap;

  // Largura da janela (3 pôsteres + 2 gaps) = 390
  const windowWidth = (posterWidth * 3) + (gap * 2);

  // Calcula o "ponto central" da janela
  const windowCenterOffset = (windowWidth / 2) - (posterWidth / 2);
  
  // Calcula o quanto o trilho deve mover:
  // 1. Começa no "ponto central" (para o item 0 ficar no centro)
  // 2. Subtrai a posição do item ativo
  const translateValue = windowCenterOffset - (activeIndex * itemWidthWithGap);
  
  return (
    <div className="movieSelector">
      
      {/* .posterList é a "JANELA" (agora larga)
      */}
      <div className="posterList">
        {/* .posterTrack é o "TRILHO" que desliza 
        */}
        <div 
          className="posterTrack"
          style={{ transform: `translateX(${translateValue}px)` }}
        >
          {movies.map((movie, index) => (
            <img
              key={movie.id}
              src={movie.posterUrl}
              alt={movie.title}
              // Adiciona a classe 'active' dinamicamente
              className={`posterImg ${index === activeIndex ? 'active' : ''}`} 
              onClick={() => onSelect(index)} 
            />
          ))}
        </div>
      </div>

      {/* Setas do Carrossel (sem alteração) */}
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