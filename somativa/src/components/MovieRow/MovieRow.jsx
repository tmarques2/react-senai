// src/components/MovieRow.jsx

import React from 'react';
import './MovieRow.css';

function MovieRow({ title, movies }) {
  return (
    <div className="movieRowContainer">
      
      {/* Título da Fileira (ex: "Destaques") */}
      <h2 className="rowTitle">{title}</h2>
      
      {/* Lista de Pôsteres */}
      <div className="posterListRow">
        {movies.map((movie) => (
          <img 
            key={movie.id} 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="posterItem"
          />
        ))}
      </div>

    </div>
  );
}

export default MovieRow;