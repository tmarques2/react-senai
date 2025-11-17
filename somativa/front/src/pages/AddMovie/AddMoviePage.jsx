import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './AddMoviePage.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx'; 
import { useAuth } from '../../context/AuthContext';

const initialState = {
  titulo: '',
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

  const { token, isAdmin } = useAuth(); // Pegar dados de auth

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

    if (!token) {
      setError('Você precisa estar logado para enviar um filme.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/sendcadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Enviar token
        },
        body: JSON.stringify(formData), 
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao cadastrar o filme.');
      }

      setSuccess(data.message + ' Redirecionando...');
      setFormData(initialState); 
      
      setTimeout(() => {
        navigate('/catalogo');
      }, 2500);

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
  
  const buttonText = isAdmin() 
    ? 'Cadastrar Filme' 
    : 'Enviar Pedido de Cadastro';

  return (
    <div className="addMoviePage">
      <div className="addMovieFormContainer">
        <h2>Cadastrar Novo Filme</h2>
        
        <form className="addMovieForm" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="titulo">Título do Filme</label>
            <input
              type="text"
              id="titulo"
              name="titulo" // Corrigido
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Crepúsculo"
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
              {isSubmitting ? 'Enviando...' : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMoviePage;