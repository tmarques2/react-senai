import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';
import './EditMovie.css'; // Importa o CSS para esta página

// --- Funções Auxiliares ---

/**
 * Converte um formato de tempo "HH:MM:SS" para um total de minutos.
 */
function timeToMinutes(timeStr) {
  if (!timeStr || !timeStr.includes(':')) {
    return '';
  }
  try {
    const parts = timeStr.split(':');
    if (parts.length !== 3) {
      return '';
    }
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return (hours * 60) + minutes;
  } catch (e) {
    console.error("Erro ao converter tempo:", e);
    return '';
  }
}

/**
 * Limpa o valor do orçamento para enviar ao backend.
 */
function cleanOrcamento(orcStr) {
    if (typeof orcStr !== 'string') {
        orcStr = String(orcStr || '0');
    }
    return orcStr
        .replace("R$", "")
        .replace(/\./g, "") // Remove pontos de milhar
        .replace(",", ".") // Troca vírgula decimal por ponto
        .trim();
}


function EditMoviePage() {
  const { id } = useParams(); // Pega o ID da URL (ex: /editar/3)
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    nome: '',
    poster: '',
    atores: '',
    diretor: '',
    ano: '',
    duracao: '', // Duração em MINUTOS
    orcamento: '',
    genero: '',
    produtora: '',
    sinopse: ''
  });

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null); // Erro ao buscar
  const [submitError, setSubmitError] = useState(null); // Erro ao enviar
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. EFEITO PARA BUSCAR OS DADOS ATUAIS DO FILME
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const response = await fetch(`http://localhost:8081/getfilme?id=${id}`);
        
        if (!response.ok) {
          throw new Error('Filme não encontrado ou falha ao buscar.');
        }
        
        const data = await response.json();
        
        setMovieData({
          nome: data.titulo || '',
          poster: data.poster || '',
          atores: data.atores || '',
          diretor: data.diretores || '', 
          ano: data.ano || '',
          duracao: timeToMinutes(data.tempo_de_duracao), 
          orcamento: cleanOrcamento(data.orcamento), 
          genero: data.generos || '', 
          produtora: data.produtoras || '',
          sinopse: data.sinopse || ''
        });
        
      } catch (e) {
        setFetchError(e.message);
        console.error("Erro ao buscar dados do filme:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]); 

  // 2. ATUALIZA O ESTADO QUANDO O USUÁRIO DIGITA
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // 3. ENVIA OS DADOS PARA O BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setIsSubmitting(true);
    setSubmitError(null);

    const dataToSend = {
      ...movieData,
      id: id,
      orcamento: cleanOrcamento(movieData.orcamento) 
    };

    try {
      const response = await fetch('http://localhost:8081/editarfilme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao salvar as alterações.');
      }

      navigate(`/filme/${id}`);

    } catch (e) {
      setSubmitError(e.message);
      console.error("Erro ao enviar formulário de edição:", e);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Renderização ---

  if (loading) {
    return <LoadingScreen />;
  }

  // Div de página de erro
  if (fetchError) {
    return (
      <div className="edit-movie-page error-page">
        <h2>Erro ao carregar dados:</h2>
        <p>{fetchError}</p>
        <Link to="/catalogo">Voltar ao Catálogo</Link>
      </div>
    );
  }

  // Div da página principal (para espaçamento e fundo)
  return (
    <div className="edit-movie-page">
      {/* Div do container do formulário (o card) */}
      <div className="edit-movie-form-container">
        <h1>Editar Filme: {movieData.nome}</h1>
        <p>Modifique os campos abaixo e salve as alterações.</p>
        
        <form onSubmit={handleSubmit} className="edit-form">
          
          <div className="form-group">
            <label htmlFor="nome">Título</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={movieData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ano">Ano de Lançamento</label>
            <input
              type="number"
              id="ano"
              name="ano"
              value={movieData.ano}
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
              value={movieData.duracao}
              onChange={handleChange}
              placeholder="Ex: 142"
            />
          </div>

          <div className="form-group">
            <label htmlFor="orcamento">Orçamento (Ex: 25000000)</label>
            <input
              type="text" 
              id="orcamento"
              name="orcamento"
              value={movieData.orcamento}
              onChange={handleChange}
              placeholder="Ex: 25000000.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="diretor">Diretor</label>
            <input
              type="text"
              id="diretor"
              name="diretor"
              value={movieData.diretor}
              onChange={handleChange}
              placeholder="Ex: Frank Darabont"
            />
          </div>

          <div className="form-group">
            <label htmlFor="produtora">Produtora</label>
            <input
              type="text"
              id="produtora"
              name="produtora"
              value={movieData.produtora}
              onChange={handleChange}
              placeholder="Ex: Castle Rock Entertainment"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="poster">URL do Poster</label>
            <input
              type="url"
              id="poster"
              name="poster"
              value={movieData.poster}
              onChange={handleChange}
              placeholder="https://... "
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="atores">Elenco (separado por vírgula)</label>
            <input
              type="text"
              id="atores"
              name="atores"
              value={movieData.atores}
              onChange={handleChange}
              placeholder="Ex: Tim Robbins, Morgan Freeman"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="genero">Gêneros (separado por vírgula)</label>
            <input
              type="text"
              id="genero"
              name="genero"
              value={movieData.genero}
              onChange={handleChange}
              placeholder="Ex: Drama, Crime"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="sinopse">Sinopse</label>
            <textarea
              id="sinopse"
              name="sinopse"
              value={movieData.sinopse}
              onChange={handleChange}
              rows="6"
            />
          </div>

          {/* --- Área de Feedback e Botões --- */}
          {submitError && (
            <p className="form-error-message">
              <strong>Erro ao salvar:</strong> {submitError}
            </p>
          )}

          <div className="form-actions">
            <Link to={`/filme/${id}`} className="cancel-button">
              Cancelar
            </Link>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMoviePage;