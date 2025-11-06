// src/components/MovieInfo/MovieInfo.jsx (CORRIGIDO)
import React from 'react';
import { Play, Star } from 'react-feather';
import './MovieInfo.css';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTAR O 'useNavigate'

// Agora recebemos 'activeIndex' para exibir o número
function MovieInfo({ movie, activeIndex }) {
  const navigate = useNavigate(); // 2. INICIALIZAR O HOOK
  const stars = Array(5).fill(null);
  
  // Formata o número para "01", "02", etc.
  const movieIndex = (activeIndex + 1).toString().padStart(2, '0');

  // 3. CRIAR A FUNÇÃO DE NAVEGAÇÃO
  const handleSaibaMais = () => {
    // Isso vai navegar para a URL /filme/3 (no caso do Batman)
    // A página MovieDetails vai carregar e pegar o 'id' da URL
    navigate(`/filme/${movie.id}`);
  };

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
      
      {/* 4. ADICIONAR O 'onClick' AO BOTÃO */}
      <button className="trailerButton" onClick={handleSaibaMais}>
        <Play size={18} fill="white" />
        <span>Saiba Mais</span>
      </button>
    </div>
  );
}

export default MovieInfo;