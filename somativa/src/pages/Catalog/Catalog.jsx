// src/pages/Catalog/Catalog.jsx
import React, { useState, useEffect } from 'react';
// Correção: Adicionando extensão .jsx para garantir a resolução
import GenreFilter from '../../components/GenreFilter/GenreFilter.jsx';
import MovieGrid from '../../components/MovieGrid/MovieGrid.jsx';
import './Catalog.css';

// Importe a tela de loading
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';

function CatalogPage() {
  // 1. Estados para loading, os filmes e erros
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState([]); // <<< NOVO: Estado para guardar os filmes
  const [error, setError] = useState(null);  // <<< NOVO: Estado para erros

  // 2. Substituímos o timer pelo fetch real
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Usa a URL do seu backend Python
        const response = await fetch('http://localhost:8000/listarfilmes');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setMovies(data); // <<< NOVO: Guarda os filmes no estado
      } catch (e) {
        setError(e.message); // <<< NOVO: Guarda a mensagem de erro
        console.error("Erro ao buscar filmes:", e);
      } finally {
        setIsLoading(false); // <<< NOVO: Para o loading (com sucesso ou erro)
      }
    };

    fetchMovies();
  }, []); // O array vazio [] garante que rode só uma vez

  // 3. Verificação de loading (continua igual)
  if (isLoading) {
    return <LoadingScreen />;
  }

  // <<< NOVO: Verificação de erro
  if (error) {
    return <div className="error-message">Erro ao carregar filmes: {error}</div>;
  }

  // 4. Seu código original da página
  return (
    <div className="catalog-background-wrapper">
      <div className="catalog-content">
        <div className="catalog-banner">
          {/* Você pode colocar um carrossel ou um player aqui */}
        </div>
        <GenreFilter />
        {/* <<< MUDANÇA: Passamos os filmes para o MovieGrid */}
        <MovieGrid movies={movies} />
      </div>
    </div>
  );
}

export default CatalogPage;