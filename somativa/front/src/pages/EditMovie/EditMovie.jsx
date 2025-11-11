// src/pages/EditMovie/EditMovie.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';
import './EditMovie.css'; 

// 1. IMPORTAR O AUTH E O MODAL
import { useAuth } from '../../context/AuthContext.jsx';
import Modal from '../../components/Modal/Modal.jsx';

// --- Funções Auxiliares (sem alteração) ---
function timeToMinutes(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return '';
  try {
    const parts = timeStr.split(':');
    if (parts.length !== 3) return '';
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return (hours * 60) + minutes;
  } catch (e) {
    console.error("Erro ao converter tempo:", e);
    return '';
  }
}
function cleanOrcamento(orcStr) {
    if (typeof orcStr !== 'string') {
        orcStr = String(orcStr || '0');
    }
    return orcStr
        .replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
}
// --- Fim das Funções Auxiliares ---


function EditMoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. PEGAR DADOS DE AUTENTICAÇÃO
  const { token, isAdmin } = useAuth();

  const [movieData, setMovieData] = useState({
    // 3. MUDAR DE 'nome' PARA 'titulo' (para ser consistente com o AddMovie)
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
  });

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 4. USAR O ESTADO DO MODAL
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  // 1. EFEITO PARA BUSCAR OS DADOS ATUAIS (envolvido em useCallback)
  const fetchMovie = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await fetch(`http://localhost:8081/getfilme?id=${id}`);
      
      if (!response.ok) {
        throw new Error('Filme não encontrado ou falha ao buscar.');
      }
      
      const data = await response.json();
      
      setMovieData({
        titulo: data.titulo || '', // 5. 'titulo'
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
  }, [id]); 

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // 6. FUNÇÃO DE SUBMIT TOTALMENTE REESCRITA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalState({ isOpen: false });

    // Determina o URL e os dados a enviar
    let url = '';
    let dataToSend = {};
    const isAdminUser = isAdmin(); // Verifica se é admin

    if (isAdminUser) {
      // --- LÓGICA DO ADMIN (Editar diretamente) ---
      url = 'http://localhost:8081/editarfilme';
      dataToSend = {
        ...movieData,
        id: id, // O endpoint de edição precisa do ID
        orcamento: cleanOrcamento(movieData.orcamento) 
      };
    } else {
      // --- LÓGICA DO UTILIZADOR COMUM (Sugerir, "Adicionar" novo) ---
      url = 'http://localhost:8081/sendcadastro';
      // O endpoint de cadastro NÃO quer o 'id'
      const { ...dataSemId } = movieData; 
      dataToSend = {
        ...dataSemId,
        orcamento: cleanOrcamento(movieData.orcamento)
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // O token é necessário para AMBOS
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao enviar a requisição.');
      }

      // Mensagem de sucesso
      const successMessage = isAdminUser 
        ? "Filme atualizado com sucesso!"
        : "Sugestão de edição enviada para aprovação!";
      
      setModalState({
        isOpen: true,
        title: "Sucesso!",
        message: successMessage,
        onConfirm: () => {
          setModalState({ isOpen: false });
          // Admin volta para o filme, Utilizador volta para o catálogo
          navigate(isAdminUser ? `/filme/${id}` : '/catalogo');
        }
      });

    } catch (e) {
      setModalState({
        isOpen: true,
        title: "Erro",
        message: e.message,
        confirmClass: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Renderização ---

  if (loading) {
    return <LoadingScreen />;
  }

  if (fetchError) {
    return (
      <div className="edit-movie-page error-page">
        {/* ... (erro) ... */}
      </div>
    );
  }

  // 7. MUDAR O TEXTO DO BOTÃO
  const buttonText = isAdmin() ? 'Salvar Alterações' : 'Enviar Sugestão de Edição';

  return (
    <>
      <div className="edit-movie-page">
        <div className="edit-movie-form-container">
          {/* 8. MUDAR DE 'nome' PARA 'titulo' */}
          <h1>Editar Filme: {movieData.titulo}</h1> 
          <p>Modifique os campos abaixo e salve as alterações.</p>
          
          <form onSubmit={handleSubmit} className="edit-form">
            
            <div className="form-group">
              {/* 9. MUDAR DE 'nome' PARA 'titulo' */}
              <label htmlFor="titulo">Título</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={movieData.titulo}
                onChange={handleChange}
                required
              />
            </div>

            {/* ... (O resto dos seus form-groups: ano, duracao, orcamento, etc.) ... */}
            <div className="form-group">
              <label htmlFor="ano">Ano de Lançamento</label>
              <input type="number" id="ano" name="ano" value={movieData.ano} onChange={handleChange} placeholder="Ex: 1994" />
            </div>
            <div className="form-group">
              <label htmlFor="duracao">Duração (em minutos)</label>
              <input type="number" id="duracao" name="duracao" value={movieData.duracao} onChange={handleChange} placeholder="Ex: 142" />
            </div>
            <div className="form-group">
              <label htmlFor="orcamento">Orçamento (Ex: 25000000)</label>
              <input type="text" id="orcamento" name="orcamento" value={movieData.orcamento} onChange={handleChange} placeholder="Ex: 25000000.00" />
            </div>
            <div className="form-group">
              <label htmlFor="diretor">Diretor</label>
              <input type="text" id="diretor" name="diretor" value={movieData.diretor} onChange={handleChange} placeholder="Ex: Frank Darabont" />
            </div>
            <div className="form-group">
              <label htmlFor="produtora">Produtora</label>
              <input type="text" id="produtora" name="produtora" value={movieData.produtora} onChange={handleChange} placeholder="Ex: Castle Rock Entertainment" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="poster">URL do Poster</label>
              <input type="url" id="poster" name="poster" value={movieData.poster} onChange={handleChange} placeholder="https://... " />
            </div>
            <div className="form-group full-width">
              <label htmlFor="atores">Elenco (separado por vírgula)</label>
              <input type="text" id="atores" name="atores" value={movieData.atores} onChange={handleChange} placeholder="Ex: Tim Robbins, Morgan Freeman" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="genero">Gêneros (separado por vírgula)</label>
              <input type="text" id="genero" name="genero" value={movieData.genero} onChange={handleChange} placeholder="Ex: Drama, Crime" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="sinopse">Sinopse</label>
              <textarea id="sinopse" name="sinopse" value={movieData.sinopse} onChange={handleChange} rows="6" />
            </div>
            

            <div className="form-actions">
              <Link to={`/filme/${id}`} className="cancel-button">
                Cancelar
              </Link>
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {/* 10. USAR O TEXTO DINÂMICO */}
                {isSubmitting ? 'Enviando...' : buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* O Modal para feedback */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        onConfirm={modalState.onConfirm || (() => setModalState({ isOpen: false }))}
        title={modalState.title}
        type="alert"
        confirmText="OK"
        confirmClass={modalState.confirmClass || 'primary'}
      >
        <p>{modalState.message}</p>
      </Modal>
    </>
  );
}

export default EditMoviePage;