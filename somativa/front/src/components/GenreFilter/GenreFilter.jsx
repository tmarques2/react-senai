// src/components/GenreFilter/GenreFilter.jsx
import React from 'react';
import './GenreFilter.css';

// 1. Receba 'activeGenre' e 'onSelectGenre' via props
function GenreFilter({ activeGenre, onSelectGenre }) {
  
  // Lista de gêneros (você pode ajustar ou buscar do banco no futuro)
  const genres = ['Todos', 'Romance', 'Comédia', 'Ação', 'Aventura', 'Fantasia', 'Terror', 'Drama', 'Ficção Científica', 'Suspense'];

  return (
    <div className="genre-filter">
      {genres.map((genre) => (
        <button
          key={genre}
          // 2. Use 'activeGenre' da prop para a classe
          className={`genre-button ${genre === activeGenre ? 'active' : ''}`}
          // 3. Chame 'onSelectGenre' da prop ao clicar
          onClick={() => onSelectGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;