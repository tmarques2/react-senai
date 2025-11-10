import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import './AdminDashboard.css'; 
// 1. IMPORTAR O NOVO MODAL
import Modal from '../../components/Modal/Modal.jsx';

// 2. Definir um estado inicial para o modal
const initialModalState = {
  isOpen: false,
  title: '',
  message: '',
  type: 'alert', // 'alert' ou 'confirm'
  onConfirm: null,
  confirmText: 'OK',
  confirmClass: 'primary'
};

const AdminDashboard = () => {
  const [pendingMovies, setPendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. Adicionar o estado do modal
  const [modalState, setModalState] = useState(initialModalState);
  
  const { token, setPendingCount } = useAuth();

  const fetchPendingMovies = async () => {
    // ... (código de fetchPendingMovies não muda)
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/filmespendentes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setPendingMovies(data);
        setPendingCount(data.length); 
      } else {
        throw new Error(data.error || 'Erro ao buscar filmes pendentes');
      }
    } catch (err) {
      setError(err.message);
      setPendingCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingMovies();
  }, [token]);

  // 4. Fechar o modal
  const closeModal = () => {
    setModalState(initialModalState);
  };
  
  // 5. ATUALIZAR O 'handleApprove'
  const handleApprove = async (filmeId, filmeTitulo) => {
    try {
      const response = await fetch('http://localhost:8081/aprovarfilme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_filme: filmeId })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }

      // Mostra o modal de SUCESSO
      setModalState({
        isOpen: true,
        title: 'Sucesso!',
        message: `O filme "${filmeTitulo}" foi aprovado com sucesso.`,
        type: 'alert',
        confirmText: 'OK',
        confirmClass: 'success'
      });
      
      fetchPendingMovies(); // Atualiza a lista

    } catch (err) {
      // Mostra o modal de ERRO
      setModalState({
        isOpen: true,
        title: 'Erro ao Aprovar',
        message: err.message,
        type: 'alert',
        confirmText: 'OK',
        confirmClass: 'danger'
      });
    }
  };

  // 6. ATUALIZAR O 'handleDelete'
  // Esta função agora SÓ ABRE O MODAL
  const handleDelete = (filmeId, filmeTitulo) => {
    setModalState({
      isOpen: true,
      title: 'Confirmar Rejeição',
      message: `Tem certeza que quer REJEITAR o filme "${filmeTitulo}"? Esta ação não pode ser desfeita.`,
      type: 'confirm',
      confirmText: 'Rejeitar',
      confirmClass: 'danger',
      onConfirm: () => confirmDelete(filmeId) // Chama a lógica de delete
    });
  };

  // 7. Lógica de delete (que antes estava no handleDelete)
  const confirmDelete = async (filmeId) => {
    try {
      const response = await fetch('http://localhost:8081/deletarfilme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: filmeId })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }
      
      closeModal(); // Fecha o modal de confirmação
      fetchPendingMovies(); // Atualiza a lista

    } catch (err) {
      // Se der erro ao deletar, mostra outro modal
      setModalState({
        isOpen: true,
        title: 'Erro ao Rejeitar',
        message: err.message,
        type: 'alert',
        confirmText: 'OK',
        confirmClass: 'danger'
      });
    }
  };

  // ... (funções de formatação não mudam) ...
  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    try {
      return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (e) {
      return 'N/A';
    }
  };
  const formatDuration = (timeString) => {
    if (!timeString) return 'N/A';
    const parts = timeString.split(':');
    if (parts.length === 3) {
        return `${parts[0]}h ${parts[1]}m`;
    }
    return timeString;
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <div className="admin-dashboard-container">
        <h2>Filmes Pendentes de Aprovação</h2>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {pendingMovies.length === 0 && !loading ? (
          <p>Nenhum filme pendente no momento.</p>
        ) : (
          <ul className="pending-list">
            {pendingMovies.map(movie => (
              <li key={movie.id_filme} className="pending-item">
                <img 
                  src={movie.poster} 
                  alt={movie.titulo} 
                  className="pending-poster"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x150/222/fff?text=Poster"; }}
                />
                <div className="pending-details">
                  <h3>{movie.titulo} ({movie.ano})</h3>
                  <p><strong>Duração:</strong> {formatDuration(movie.tempo_de_duracao)}</p>
                  <p><strong>Orçamento:</strong> {formatCurrency(movie.orcamento)}</p>
                  <p><strong>Produtora(s):</strong> {movie.produtoras || 'N/A'}</p>
                  <p><strong>Diretor:</strong> {movie.diretores || 'N/A'}</p>
                  <p><strong>Gêneros:</strong> {movie.generos || 'N/A'}</p>
                  <p><strong>Elenco:</strong> {movie.atores || 'N/A'}</p>
                  <p><strong>Sinopse:</strong> {movie.sinopse || 'N/A'}</p>
                </div>
                <div className="pending-actions">
                  {/* 8. Passar o título do filme para as funções */}
                  <button onClick={() => handleApprove(movie.id_filme, movie.titulo)} className="approve-button">
                    Aprovar
                  </button>
                  <button onClick={() => handleDelete(movie.id_filme, movie.titulo)} className="reject-button">
                    Rejeitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* 9. ADICIONAR O COMPONENTE MODAL NO FINAL DO JSX */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm || closeModal}
        title={modalState.title}
        type={modalState.type}
        confirmText={modalState.confirmText}
        confirmClass={modalState.confirmClass}
      >
        <p>{modalState.message}</p>
      </Modal>
    </>
  );
};

export default AdminDashboard;