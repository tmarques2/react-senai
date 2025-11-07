// src/components/MovieBackground.jsx

import React from 'react';
import './MovieBackground.css'; // Importação de CSS normal

function MovieBackground({ movies, activeIndex }) {
  return (
    <div className="backgroundContainer">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`bgImage ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${movie.backgroundUrl})` }}
        />
      ))}
      <div className="bgOverlay" />
    </div>
  );
}

export default MovieBackground;