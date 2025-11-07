// src/pages/MovieDetails/MovieDetails.jsx
import React, { useState, useEffect } from 'react';
// Importa hooks para navegação e parâmetros da URL
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';
import './MovieDetails.css'; // Importa o CSS para esta página

function MovieDetailsPage() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- Estados para a funcionalidade de Deletar ---
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // Pega o parâmetro :id da URL
  const { id } = useParams(); 
  // Hook para navegar entre páginas
  const navigate = useNavigate(); 

  // Efeito para buscar os dados do filme
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/getfilme?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`Filme não encontrado (Status: ${response.status})`);
        }
        
        const data = await response.json();

        // Limpa e formata os dados que vêm do banco
        if (data) {
          data.diretores = data.diretores || 'Não informado';
          data.atores = data.atores || 'Não informado';
          data.generos = data.generos || 'Não informado';
          data.produtoras = data.produtoras || 'Não informado';
          data.sinopse = data.sinopse || 'Sinopse não disponível.';
          data.orcamento = data.orcamento ? parseFloat(data.orcamento).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Não informado';
          data.tempo_de_duracao = data.tempo_de_duracao || 'Não informado';
        }
        
        setMovie(data);
      } catch (e) {
        setError(e.message);
        console.error("Erro ao buscar detalhes do filme:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]); // Re-execute se o ID na URL mudar

  // --- Funções de Ação ---

  // 1. Abre o modal de confirmação
  const handleDeleteClick = () => {
    setShowModal(true); 
    setDeleteError(null); // Limpa erros antigos
  };

  // 2. Confirma a exclusão
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch('http://localhost:8000/deletarfilme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }), // Envia o ID no corpo JSON
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao deletar o filme.');
      }

      // Sucesso!
      setShowModal(false);
      // Navega de volta ao catálogo
      navigate('/catalogo'); 

    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // 3. Cancela a exclusão
  const handleCancelDelete = () => {
    if (!isDeleting) {
      setShowModal(false);
    }
  };

  // 4. Navega para a página de edição
  const handleEditClick = () => {
    navigate(`/editar/${id}`);
  };


  // --- Renderização ---

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="movie-details-container" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h2>Erro ao carregar filme:</h2>
        <p style={{ color: '#ff0000' }}>{error}</p>
        <Link to="/catalogo" className="back-link">Voltar ao Catálogo</Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-container" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h2>Filme não encontrado.</h2>
        <Link to="/catalogo" className="back-link">Voltar ao Catálogo</Link>
      </div>
    );
  }

  return (
    <>
      <div className="movie-details-container">
        <div className="movie-content">
          
          {/* Coluna do Poster */}
          <div className="movie-poster-wrapper">
            <img 
              src={movie.poster} 
              alt={movie.titulo}
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x600/222/fff?text=Poster"; }}
            />
          </div>
          
          {/* Coluna das Informações */}
          <div className="movie-info">
            <h1>{movie.titulo} ({movie.ano})</h1>
            
            <div className="info-item">
              <strong>Gênero:</strong>
              <span>{movie.generos}</span>
            </div>
            <div className="info-item">
              <strong>Diretor:</strong>
              <span>{movie.diretores}</span>
            </div>
            <div className="info-item">
              <strong>Elenco:</strong>
              <span>{movie.atores}</span>
            </div>
            <div className="info-item">
              <strong>Produtora:</strong>
              <span>{movie.produtoras}</span>
            </div>
            <div className="info-item">
              <strong>Duração:</strong>
              <span>{movie.tempo_de_duracao}</span>
            </div>
            <div className="info-item">
              <strong>Orçamento:</strong>
              <span>{movie.orcamento}</span>
            </div>
            
            <div className="sinopse-block">
              <h3>Sinopse</h3>
              <p>{movie.sinopse}</p>
            </div>

            {/* --- BOTÕES DE AÇÃO --- */}
            <div className="action-buttons">
              <button onClick={handleEditClick} className="edit-button">
                Editar
              </button>
              <button onClick={handleDeleteClick} className="delete-button">
                Remover
              </button>
            </div>

            <Link to="/catalogo" className="back-link">
              Voltar ao Catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Você tem certeza que deseja remover o filme "{movie.titulo}"? Esta ação não pode ser desfeita.</p>
            
            {deleteError && (
              <p className="modal-error">{deleteError}</p>
            )}

            <div className="modal-buttons">
              <button 
                onClick={handleCancelDelete} 
                disabled={isDeleting}
                className="modal-button cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDelete} 
                disabled={isDeleting}
                className="modal-button confirm"
              >
                {isDeleting ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MovieDetailsPage;