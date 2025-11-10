// src/pages/MovieDetails/MovieDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';
import './MovieDetails.css';

// --- 1. IMPORTE O useAuth ---
import { useAuth } from '../../context/AuthContext.jsx';

function MovieDetailsPage() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  // --- 2. PEGUE AS INFORMAÇÕES DE AUTH ---
  const { isAdmin, token } = useAuth();
  
  // Efeito para buscar os dados do filme (sem alteração)
  useEffect(() => {
    // ... (seu código de fetchMovie continua igual) ...
    const fetchMovie = async () => {
       try {
         setLoading(true);
         setError(null);
         const response = await fetch(`http://localhost:8081/getfilme?id=${id}`);
         
         if (!response.ok) {
           throw new Error(`Filme não encontrado (Status: ${response.status})`);
         }
         
         const data = await response.json();

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
  }, [id]);

  // ... (handleDeleteClick) ...
  const handleDeleteClick = () => {
     setShowModal(true); 
     setDeleteError(null);
   };

  // --- 3. MODIFIQUE a função de deletar ---
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch('http://localhost:8081/deletarfilme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ADICIONE O TOKEN DE AUTORIZAÇÃO
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao deletar o filme.');
      }

      setShowModal(false);
      navigate('/catalogo'); 

    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // ... (handleCancelDelete, handleEditClick) ...
   const handleCancelDelete = () => {
     if (!isDeleting) {
       setShowModal(false);
     }
   };
   const handleEditClick = () => {
     navigate(`/editar/${id}`);
   };

  // ... (Renderização de loading, error, !movie) ...
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
             {/* ... (seu img tag) ... */}
             <img 
               src={movie.poster} 
               alt={movie.titulo}
               onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x600/222/fff?text=Poster"; }}
             />
          </div>
          
          {/* Coluna das Informações */}
          <div className="movie-info">
            <h1>{movie.titulo} ({movie.ano})</h1>
            
            {/* ... (todos os info-item) ... */}
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
         _ </div>
             <div className="info-item">
               <strong>Orçamento:</strong>
               <span>{movie.orcamento}</span>
             </div>

            <div className="sinopse-block">
              <h3>Sinopse</h3>
              <p>{movie.sinopse}</p>
            </div>

            {/* --- 4. PROTEJA OS BOTÕES DE AÇÃO --- */}
            {/* Estes botões só aparecem se o usuário for admin */}
            {isAdmin() && (
              <div className="action-buttons">
                <button onClick={handleEditClick} className="edit-button">
                  Editar
                </button>
                <button onClick={handleDeleteClick} className="delete-button">
                  Remover
                </button>
              </div>
            )}
            
            <Link to="/catalogo" className="back-link">
              Voltar ao Catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* --- O Modal não precisa de alteração --- */}
      {showModal && (
        <div className="modal-overlay">
           {/* ... (seu código do modal) ... */}
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