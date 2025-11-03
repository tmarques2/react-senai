// src/pages/AddMovie/AddMoviePage.jsx
import React, { useState, useEffect } from 'react'; // 1. Importe useEffect
import './AddMoviePage.css';

// 2. Importe a tela de loading
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';

function AddMoviePage() {
  const [formData, setFormData] = useState({ /* ... */ });
  
  // 3. Adicione o estado de loading
  const [isLoading, setIsLoading] = useState(true);

  // 4. Adicione o timer artificial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 1.5 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => { /* ... */ };
  const handleSubmit = (e) => { /* ... */ };

  // 5. Verificação de loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 6. Seu código original da página
  return (
    <div className="addMoviePage">
      <div className="addMovieFormContainer">
        <h2>Cadastrar Novo Filme</h2>
        <form className="addMovieForm" onSubmit={handleSubmit}>
          {/* ... (Seus inputs e labels) ... */}
          <label htmlFor="title">Título do Filme</label>
          <input type="text" id="title" name="title" /* ... */ />
          <label htmlFor="posterUrl">URL do Pôster (Vertical)</label>
          <input type="text" id="posterUrl" name="posterUrl" /* ... */ />
          <label htmlFor="bannerUrl">URL do Banner (Horizontal)</label>
          <input type="text" id="bannerUrl" name="bannerUrl" /* ... */ />
          <label htmlFor="genre">Gênero Principal</label>
          <input type="text" id="genre" name="genre" /* ... */ />
          <label htmlFor="description">Descrição</label>
          <textarea id="description" name="description" /* ... */ ></textarea>
          <button type="submit" className="submitMovieButton">
            Cadastrar Filme
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMoviePage;