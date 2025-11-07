import React from 'react';
import { Link } from 'react-router-dom';
import './MovieRow.css';

function MovieRow({ title, movies }) {
  return (
    <div className="movieRowContainer">
      
      {/* Título da Fileira (ex: "Destaques") */}
      <h2 className="rowTitle">{title}</h2>
      
      {/* Lista de Pôsteres */}
      <div className="posterListRow">
        {movies.map((movie) => (
          
          // 2. SUBSTITUÍMOS a <img> por um <Link>
          <Link 
            key={movie.id} // A 'key' agora vai no Link
            to={`/filme/${movie.id}`} // 3. Este é o destino
            title={movie.title} // Dica para o usuário
            className="posterItem" // 4. A classe principal agora está no Link
          >
            {/* 5. A <img> agora fica DENTRO do Link */}
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="posterItemImage" // 6. Damos a ela uma nova classe
            />
          </Link>
        ))}
      </div>

    </div>
  );
}

export default MovieRow;