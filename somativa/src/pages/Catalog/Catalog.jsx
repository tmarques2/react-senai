// src/pages/Catalog/Catalog.jsx
import React, { useState, useEffect } from 'react';
import GenreFilter from '../../components/GenreFilter/GenreFilter.jsx';
import MovieGrid from '../../components/MovieGrid/MovieGrid.jsx';
import './Catalog.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel.jsx';

function CatalogPage() {
  // Estados da página
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para o filtro
  const [allMovies, setAllMovies] = useState([]); // Guarda TODOS os filmes
  const [selectedGenre, setSelectedGenre] = useState('Todos'); // Guarda o gênero ativo
  const [filteredMovies, setFilteredMovies] = useState([]); // Guarda os filmes para exibir

  // Efeito para buscar os filmes da API (só roda 1 vez)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8000/listarfilmes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Guarda na lista completa
        setAllMovies(data); 
      } catch (e) {
        setError(e.message);
        console.error("Erro ao buscar filmes:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []); // [] = Roda só no "mount"

  // --- EFEITO DE FILTRAGEM (COM CORREÇÃO) ---
  // Roda sempre que o 'selectedGenre' ou 'allMovies' mudar
  useEffect(() => {
    
    // Se for "Todos", a lista filtrada é a lista completa
    if (selectedGenre === 'Todos') {
      setFilteredMovies(allMovies);
    } else {
      // Se for outro gênero, filtre a lista 'allMovies'
      const filtered = allMovies.filter(movie => {
        // 1. Verifique se o filme sequer tem gêneros
        if (!movie.generos) {
          return false; 
        }

        // 2. LÓGICA ROBUSTA:
        //    - split(',') -> divide por vírgula, não importa se tem espaço
        //    - .map(g => g.trim()) -> remove espaços em branco de cada item
        const genresArray = movie.generos.split(',').map(g => g.trim());
        
        // 3. Verifique se o gênero selecionado está no array limpo
        return genresArray.includes(selectedGenre);
      });
      
      // Atualiza a lista de filmes exibidos
      setFilteredMovies(filtered);
    }
  }, [selectedGenre, allMovies]); // Dependências: rode se 'selectedGenre' ou 'allMovies' mudar
  // --- FIM DO EFEITO DE FILTRAGEM ---


  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="error-message">Erro ao carregar filmes: {error}</div>;
  }

  // O Return agora usa os novos estados
  return (
    <div className="catalog-background-wrapper">
      <div className="catalog-content">
        
        <BannerCarousel />

        {/* Passamos o estado e a função para o filtro */}
        <GenreFilter
          activeGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        {/* Passamos a lista JÁ FILTRADA para o Grid */}
        <MovieGrid movies={filteredMovies} />
      
      </div>
    </div>
  );
}

export default CatalogPage;