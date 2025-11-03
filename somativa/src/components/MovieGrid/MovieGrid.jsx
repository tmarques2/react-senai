// src/components/MovieGrid/MovieGrid.jsx
import React from 'react';
import './MovieGrid.css';

function MovieGrid() {
  // Cria um array com 12 itens para os placeholders (como na sua foto)
  const placeholders = Array(12).fill(0);

  return (
    <div className="movie-grid">
      {placeholders.map((_, index) => (
        <div key={index} className="movie-card-placeholder">
          {/* No futuro, você vai substituir este div por um 
            componente <MovieCard> com os dados reais do filme 
          */}
        </div>
      ))}
    </div>
  );
}

export default MovieGrid;