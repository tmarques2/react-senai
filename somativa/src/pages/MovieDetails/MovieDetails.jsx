// src/pages/MovieDetails/MovieDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx'; // Importe seu LoadingScreen
import './MovieDetails.css'; // Importe o CSS que acabamos de criar!

// Importe MainLayout se quiser que o header e footer apareçam
// import MainLayout from '../../components/MainLayout/MainLayout.jsx'; 


const MovieDetailsPage = () => { // Renomeado para seguir o padrão Page
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams(); 

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getfilme?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Ajuste para garantir que dados como 'generos' e 'produtoras' sejam strings vazias se null
        if (data) {
          data.diretores = data.diretores || 'N/A';
          data.atores = data.atores || 'N/A';
          data.generos = data.generos || 'N/A';
          data.produtoras = data.produtoras || 'N/A';
          data.sinopse = data.sinopse || 'Sinopse não disponível.';
          data.orcamento = data.orcamento ? parseFloat(data.orcamento).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A';
          data.tempo_de_duracao = data.tempo_de_duracao || 'N/A';
        }
        setMovie(data);
      } catch (e) {
        setError(e.message);
        console.error("Erro ao buscar detalhes do filme:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
        <div className="movie-details-container" style={{ color: 'red' }}>
            Erro ao carregar filme: {error}
        </div>
    );
  }

  if (!movie) {
    return (
        <div className="movie-details-container">
            Filme não encontrado.
        </div>
    );
  }

  return (
    // Você pode envolver isso em MainLayout se quiser o header/footer
    // <MainLayout> 
      <div className="movie-details-container">
        <div className="movie-content">
          <div className="movie-poster-wrapper">
            <img 
              src={movie.poster} 
              alt={movie.titulo} 
              onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x450?text=Poster+N/A"; }} // Fallback para poster
            />
          </div>
          <div className="movie-info">
            <h1>{movie.titulo} ({movie.ano})</h1>
            <p><strong>Gênero:</strong> {movie.generos}</p>
            <p><strong>Diretor:</strong> {movie.diretores}</p>
            <p><strong>Elenco:</strong> {movie.atores}</p>
            <p><strong>Produtora:</strong> {movie.produtoras}</p>
            <p><strong>Duração:</strong> {movie.tempo_de_duracao}</p>
            <p><strong>Orçamento:</strong> {movie.orcamento}</p>
            
            <h3>Sinopse</h3>
            <p>{movie.sinopse}</p>
          </div>
        </div>
      </div>
    // </MainLayout>
  );
};

export default MovieDetailsPage;