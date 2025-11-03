// src/pages/Catalog/Catalog.jsx
import React, { useState, useEffect } from 'react'; // 1. Importe os hooks
import GenreFilter from '../../components/GenreFilter/GenreFilter';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import './Catalog.css';

// 2. Importe a tela de loading
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';

function CatalogPage() {
  
  // 3. Adicione o estado de loading
  const [isLoading, setIsLoading] = useState(true);

  // 4. Adicione o timer artificial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 1.5 segundos

    return () => clearTimeout(timer); // Limpa o timer
  }, []); // O array vazio [] garante que rode só uma vez

  // 5. Verificação de loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 6. Seu código original da página
  return (
    <div className="catalog-background-wrapper">
      <div className="catalog-content">
        <div className="catalog-banner">
          {/* Você pode colocar um carrossel ou um player aqui */}
        </div>
        <GenreFilter />
        <MovieGrid />
      </div>
    </div>
  );
}

export default CatalogPage;