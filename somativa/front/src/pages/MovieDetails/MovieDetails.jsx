import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';
import './MovieDetails.css';
import { useAuth } from '../../context/AuthContext.jsx';

// 1. IMPORTAR O NOVO MODAL
import Modal from '../../components/Modal/Modal.jsx';

function MovieDetailsPage() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. MUDAR O NOME DO ESTADO para ser mais claro
  const [isModalOpen, setIsModalOpen] = useState(false); // Era 'showModal'
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { isAdmin, token } = useAuth();
  
  // ... (useEffect de fetchMovie não muda) ...
  useEffect(() => {
    const fetchMovie = async () => {
       try {
         setLoading(true);
         setError(null);
         const response = await fetch(`http://localhost:8081/getfilme?id=${id}`);
         if (!response.ok) {
           throw new Error(`Filme não encontrado (Status: ${response.status})`);
         }
         const data = await response.json();
         // ... (formatação de dados)
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
       } finally {
         setLoading(false);
       }
     };
     fetchMovie();
  }, [id]);

  // 3. Atualizar funções para usar o novo estado
  const handleDeleteClick = () => {
    setIsModalOpen(true); 
    setDeleteError(null); 
  };
  
  const handleCancelDelete = () => {
    if (!isDeleting) {
      setIsModalOpen(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch('http://localhost:8081/deletarfilme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: id }), 
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao deletar o filme.');
      }
      
      setIsModalOpen(false);
      navigate('/catalogo'); 

    } catch (e) {
      // 4. Mostrar erro *dentro* do modal
      setDeleteError(e.message);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleEditClick = () => {
    navigate(`/editar/${id}`);
  };

  // ... (Renderização de loading, error, !movie) ...
  if (loading) return <LoadingScreen />;
  if (error) return ( <div>...Erro...</div> );
  if (!movie) return ( <div>...Não encontrado...</div> );

  return (
    <>
      <div className="movie-details-container">
        {/* ... (Todo o seu JSX da página de detalhes) ... */}
        {/* ... (movie-content, movie-poster-wrapper, movie-info) ... */}
        {/* ... (sinopse-block, action-buttons, etc) ... */}
         <div className="movie-content">
          <div className="movie-poster-wrapper">
            <img 
              src={movie.poster} 
              alt={movie.titulo}
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x600/222/fff?text=Poster"; }}
            />
          </div>
          <div className="movie-info">
            <h1>{movie.titulo} ({movie.ano})</h1>
            <div className="info-item"><strong>Gênero:</strong><span>{movie.generos}</span></div>
            <div className="info-item"><strong>Diretor:</strong><span>{movie.diretores}</span></div>
            <div className="info-item"><strong>Elenco:</strong><span>{movie.atores}</span></div>
            <div className="info-item"><strong>Produtora:</strong><span>{movie.produtoras}</span></div>
            <div className="info-item"><strong>Duração:</strong><span>{movie.tempo_de_duracao}</span></div>
            <div className="info-item"><strong>Orçamento:</strong><span>{movie.orcamento}</span></div>
            <div className="sinopse-block">
              <h3>Sinopse</h3>
              <p>{movie.sinopse}</p>
            </div>
            {isAdmin() && (
              <div className="action-buttons">
                <button onClick={handleEditClick} className="edit-button">Editar</button>
                <button onClick={handleDeleteClick} className="delete-button">Remover</button>
              </div>
            )}
            <Link to="/catalogo" className="back-link">Voltar ao Catálogo</Link>
          </div>
        </div>
      </div>

      {/* 5. SUBSTITUIR O CÓDIGO DO MODAL ANTIGO PELO NOVO COMPONENTE */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        type="confirm"
        confirmText={isDeleting ? 'Removendo...' : 'Remover'}
        confirmClass="danger" 
      >
        <p>Você tem certeza que deseja remover o filme "{movie?.titulo}"? Esta ação não pode ser desfeita.</p>
        {/* Mostra o erro de delete dentro do modal */}
        {deleteError && (
          <p style={{ color: '#E50914', marginTop: '1rem', fontWeight: 'bold' }}>
            Erro: {deleteError}
          </p>
        )}
      </Modal>
    </>
  );
}

export default MovieDetailsPage;