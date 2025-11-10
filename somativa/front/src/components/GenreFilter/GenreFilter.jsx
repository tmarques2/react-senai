// src/components/GenreFilter/GenreFilter.jsx
import React from 'react';
// Importação do CSS atualizado
import './GenreFilter.css';

// 1. Receba 'activeGenre' e 'onSelectGenre' via props
function GenreFilter({ activeGenre, onSelectGenre }) {
  
  // Lista de gêneros (você pode ajustar ou buscar do banco no futuro)
  const genres = ['Todos', 'Romance', 'Comédia', 'Ação', 'Aventura', 'Fantasia', 'Terror', 'Drama', 'Ficção Científica', 'Suspense'];

  return (
    // Semanticamente, um filtro é uma forma de navegação.
    // Usando a classe camelCase "genreFilter"
    <nav className="genreFilter" role="navigation" aria-label="Filtro de gêneros">
      {genres.map((genre) => (
        <button
          key={genre}
          // 2. Usando a classe camelCase "genreButton"
          className={`genreButton ${genre === activeGenre ? 'active' : ''}`}
          // 3. Chame 'onSelectGenre' da prop ao clicar
          onClick={() => onSelectGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </nav>
  );
}

export default GenreFilter;