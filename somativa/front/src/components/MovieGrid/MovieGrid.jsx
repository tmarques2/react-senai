// src/components/MovieGrid/MovieGrid.jsx
import React from 'react';
// <<< NOVO: Importe o Link para navegar
import { Link } from 'react-router-dom'; 
import './MovieGrid.css';

// <<< MUDANÇA: Recebe 'movies' como uma prop
function MovieGrid({ movies }) {
  return (
    <div className="movie-grid">
      {/* <<< MUDANÇA: Trocamos 'placeholders.map' por 'movies.map' */}
      {movies.map(movie => (
        // Usamos o 'id_filme' do banco como key
        <div key={movie.id_filme} className="movie-card"> 
          
          {/* <<< NOVO: O Link leva para /filme/ID_DO_FILME */}
          <Link to={`/filme/${movie.id_filme}`}>
            <img 
              src={movie.poster} 
              alt={movie.titulo} 
              className="movie-poster"
              // Adiciona um fallback simples caso o poster falhe
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x450/222/fff?text=Poster"; }}
            />
            <div className="movie-title">{movie.titulo}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default MovieGrid;