import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './AddMoviePage.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx'; 
// 1. IMPORTAR O CONTEXTO DE AUTENTICAÇÃO
import { useAuth } from '../../context/AuthContext';

// 2. CORRIGIR O ESTADO INICIAL (de 'nome' para 'titulo')
const initialState = {
  titulo: '', // Era 'nome'
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

  // 3. PEGAR DADOS DE AUTENTICAÇÃO
  const { token, isAdmin } = useAuth();

  // Efeito de loading (sem alteração)
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

  // 4. ATUALIZAR O SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Se não estiver logado, não faz nada (embora a rota já proteja)
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
          // ADICIONAR O TOKEN DE AUTORIZAÇÃO
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData), 
      });

      const data = await response.json(); // Pega a resposta do servidor

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao cadastrar o filme.');
      }

      // USA A MENSAGEM VINDA DO SERVIDOR
      // (ex: "Filme enviado para aprovação")
      setSuccess(data.message + ' Redirecionando...');
      setFormData(initialState); 
      
      setTimeout(() => {
        navigate('/catalogo');
      }, 2500); // Aumentei o tempo para dar para ler a msg

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
  
  // 5. DETERMINAR O TEXTO DO BOTÃO
  const buttonText = isAdmin() 
    ? 'Cadastrar Filme' 
    : 'Enviar Pedido de Cadastro';

  return (
    <div className="addMoviePage">
      <div className="addMovieFormContainer">
        <h2>Cadastrar Novo Filme</h2>
        
        <form className="addMovieForm" onSubmit={handleSubmit}>
          
          {/* --- Coluna 1 --- */}
          <div className="form-group">
            <label htmlFor="titulo">Título do Filme</label>
            <input
              type="text"
              // 6. CORRIGIR ID E NOME
              id="titulo"
              name="titulo"
              value={formData.titulo}
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
              {/* 7. MUDAR O TEXTO DO BOTÃO DINAMICAMENTE */}
              {isSubmitting ? 'Enviando...' : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMoviePage;