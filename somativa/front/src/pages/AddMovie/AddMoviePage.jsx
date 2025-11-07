import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './AddMoviePage.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx'; 

// Estado inicial do formulário
const initialState = {
  nome: '',
  poster: '',
  atores: '',
  diretor: '',
  ano: '',
  duracao: '',
  orcamento: '',
  genero: '',
  produtora: '',
  sinopse: ''
};

function AddMoviePage() {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Efeito para o loading cosmético
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8000/sendcadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao cadastrar o filme.');
      }

      setSuccess('Filme cadastrado com sucesso! Redirecionando...');
      setFormData(initialState); 
      
      setTimeout(() => {
        navigate('/catalogo');
      }, 2000);

    } catch (e) {
      setError(e.message);
      console.error("Erro ao cadastrar filme:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="addMoviePage">
      <div className="addMovieFormContainer">
        <h2>Cadastrar Novo Filme</h2>
        
        <form className="addMovieForm" onSubmit={handleSubmit}>
          
          {/* --- Coluna 1 --- */}
          <div className="form-group">
            <label htmlFor="nome">Título do Filme</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Um Sonho de Liberdade"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="orcamento">Orçamento</label>
            <input
              type="number"
              id="orcamento"
              name="orcamento"
              value={formData.orcamento}
              onChange={handleChange}
              placeholder="Ex: 25000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="diretor">Diretor</label>
            <input
              type="text"
              id="diretor"
              name="diretor"
              value={formData.diretor}
              onChange={handleChange}
              placeholder="Ex: Frank Darabont"
            />
          </div>
          
          {/* --- Coluna 2 --- */}
          <div className="form-group">
            <label htmlFor="ano">Ano de Lançamento</label>
            <input
              type="number"
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              placeholder="Ex: 1994"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duracao">Duração (em minutos)</label>
            <input
              type="number"
              id="duracao"
              name="duracao"
              value={formData.duracao}
              onChange={handleChange}
              placeholder="Ex: 142"
            />
          </div>
          
          {/* Produtora agora está na Coluna 2 */}
          <div className="form-group">
            <label htmlFor="produtora">Produtora</label>
            <input
              type="text"
              id="produtora"
              name="produtora"
              value={formData.produtora}
              onChange={handleChange}
              placeholder="Ex: Castle Rock Entertainment"
            />
          </div>

          {/* --- Campos de Largura Total --- */}
          
          {/* URL do Pôster agora está em Largura Total */}
          <div className="form-group form-group-full">
            <label htmlFor="poster">URL do Pôster (Vertical)</label>
            <input
              type="text"
              id="poster"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="atores">Elenco (separado por vírgula)</label>
            <input
              type="text"
              id="atores"
              name="atores"
              value={formData.atores}
              onChange={handleChange}
              placeholder="Ex: Tim Robbins, Morgan Freeman"
            />
          </div>
          
          <div className="form-group form-group-full">
            <label htmlFor="genero">Gêneros (separado por vírgula)</label>
            <input
              type="text"
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              placeholder="Ex: Drama, Crime"
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="sinopse">Sinopse</label>
            <textarea
              id="sinopse"
              name="sinopse"
              rows="5"
              value={formData.sinopse}
              onChange={handleChange}
              placeholder="Descreva o filme..."
            ></textarea>
          </div>

          {/* --- Ações do Formulário --- */}
          <div className="form-group-full">
            {error && (
              <div className="form-message error-message">{error}</div>
            )}
            {success && (
              <div className="form-message success-message">{success}</div>
            )}

            <button
              type="submit"
              className="submitMovieButton"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Filme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMoviePage;