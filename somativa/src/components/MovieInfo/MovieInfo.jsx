import React from 'react';
import { Play, Star } from 'react-feather';
import './MovieInfo.css';

// Agora recebemos 'activeIndex' para exibir o número
function MovieInfo({ movie, activeIndex }) {
  const stars = Array(5).fill(null);
  
  // Formata o número para "01", "02", etc.
  const movieIndex = (activeIndex + 1).toString().padStart(2, '0');

  return (
    // A classe 'movieInfo' não precisa mais de 'position: absolute'
    <div className="movieInfo">
      
      {/* NÚMERO DO SLIDE (NOVO) */}
      <span className="movieIndex">TOP {movieIndex}</span>

      <h1>{movie.title}</h1>
      
      <div className="movieMeta">
        <div className="starRating">
          {stars.map((_, i) => (
            <Star key={i} size={18} fill="#FFD700" stroke="#FFD700" />
          ))}
        </div>
        <span className="genres">
          {movie.genres.join(', ')}
        </span>
        <span className="ratingBadge">{movie.rating}</span>
      </div>
      
      <p>{movie.description}</p>
      
      <button className="trailerButton">
        <Play size={18} fill="white" />
        <span>Saiba Mais</span>
      </button>
    </div>
  );
}

export default MovieInfo;