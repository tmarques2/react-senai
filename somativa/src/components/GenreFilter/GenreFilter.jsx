// src/components/GenreFilter/GenreFilter.jsx
import React, { useState } from 'react';
import './GenreFilter.css';

function GenreFilter() {
  const genres = ['Todos', 'Romance', 'Comédia', 'Ação', 'Aventura', 'Fantasia', 'Terror'];
  const [activeGenre, setActiveGenre] = useState('Todos');

  return (
    <div className="genre-filter">
      {genres.map((genre) => (
        <button
          key={genre}
          className={`genre-button ${genre === activeGenre ? 'active' : ''}`}
          onClick={() => setActiveGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;