// src/pages/Catalog/Catalog.jsx
import React, { useState, useEffect } from 'react';
// 👇 1. Importe o useSearchParams
import { useSearchParams } from 'react-router-dom';
import GenreFilter from '../../components/GenreFilter/GenreFilter.jsx';
import MovieGrid from '../../components/MovieGrid/MovieGrid.jsx';
import './Catalog.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel.jsx';

function CatalogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [filteredMovies, setFilteredMovies] = useState([]);

  // 👇 2. Hook para ler os parâmetros da URL
  const [searchParams] = useSearchParams();
  // Pega o valor de "?search=..."
  const searchTerm = searchParams.get('search');

  // Efeito para buscar os filmes da API
  // 👇 3. Adicione 'searchTerm' como dependência
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true); // Mostra o loading a cada nova busca
      setError(null);
      
      // Constrói a URL base
      let url = 'http://localhost:8081/listarfilmes';

      // 👇 4. Se houver um termo de busca, adiciona à URL
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllMovies(data); 
      } catch (e) {
        setError(e.message);
        setAllMovies([]); // Limpa os filmes em caso de erro
        console.error("Erro ao buscar filmes:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm]); // Roda sempre que o termo de busca na URL mudar

  
  // Efeito de Filtragem (Lado do Cliente)
  // (Este código continua funcionando perfeitamente)
  useEffect(() => {
    if (selectedGenre === 'Todos') {
      setFilteredMovies(allMovies);
    } else {
      const filtered = allMovies.filter(movie => {
        if (!movie.generos) {
          return false; 
        }
        const genresArray = movie.generos.split(',').map(g => g.trim());
        return genresArray.includes(selectedGenre);
      });
      setFilteredMovies(filtered);
    }
  }, [selectedGenre, allMovies]);


  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // 👇 5. Mensagem customizada se a busca não retornar nada
  if (error) {
    return <div className="error-message">Erro ao carregar filmes: {error}</div>;
  }
  
  // Se não estiver carregando, não houver erro, mas a lista estiver vazia
  const noResults = !isLoading && !error && filteredMovies.length === 0;

  return (
    <div className="catalog-background-wrapper">
      <div className="catalog-content">
        
        <BannerCarousel />

        <GenreFilter
          activeGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        {/* 👇 6. Lógica para exibir "Nenhum resultado" */}
        {noResults ? (
          <div className="no-results-message">
            {searchTerm ? 
              `Nenhum filme encontrado para "${searchTerm}".` : 
              'Nenhum filme encontrado.'
            }
          </div>
        ) : (
          <MovieGrid movies={filteredMovies} />
        )}
      
      </div>
    </div>
  );
}

export default CatalogPage;