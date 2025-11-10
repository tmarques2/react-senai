import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
// 1. IMPORTAR O CSS (Se ainda não o fez)
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const [pendingMovies, setPendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchPendingMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/filmespendentes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setPendingMovies(data);
      } else {
        throw new Error(data.error || 'Erro ao buscar filmes pendentes');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Busca os filmes quando a página carrega
    fetchPendingMovies();
  }, [token]);

  // Funções handleApprove e handleDelete (sem alteração)
  const handleApprove = async (filmeId) => {
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
      alert(data.message || data.error);
      if (response.ok) {
        fetchPendingMovies(); // Atualiza a lista
      }
    } catch (err) {
      alert('Erro ao aprovar filme.');
    }
  };

  const handleDelete = async (filmeId) => {
    if (!window.confirm("Tem certeza que quer REJEITAR esta sugestão? Ela será deletada.")) {
      return;
    }
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
      alert(data.message || data.error);
      if (response.ok) {
        fetchPendingMovies(); // Atualiza a lista
      }
    } catch (err) {
      alert('Erro ao deletar filme.');
    }
  };

  // --- 2. FUNÇÕES DE FORMATAÇÃO ---
  // Formata o valor do orçamento (ex: R$ 63.000.000,00)
  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    try {
      return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (e) {
      return 'N/A';
    }
  };

  // Formata o tempo (ex: 02:07:00 -> 02h 07m)
  const formatDuration = (timeString) => {
    if (!timeString) return 'N/A';
    const parts = timeString.split(':');
    if (parts.length === 3) {
        return `${parts[0]}h ${parts[1]}m`;
    }
    return timeString; // Fallback
  };
  // --- FIM DAS FUNÇÕES DE FORMATAÇÃO ---

  if (loading) return <LoadingScreen />;

  return (
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
              {/* --- 3. CAMPOS ATUALIZADOS AQUI --- */}
              <div className="pending-details">
                <h3>{movie.titulo} ({movie.ano})</h3>
                
                <p><strong>Duração:</strong> {formatDuration(movie.tempo_de_duracao)}</p>
                <p><strong>Orçamento:</strong> {formatCurrency(movie.orcamento)}</p>
                <p><strong>Produtora(s):</strong> {movie.produtoras || 'N/A'}</p>
                <p><strong>Diretor:</strong> {movie.diretores || 'N/A'}</p>
                <p><strong>Gêneros:</strong> {movie.generos || 'N/A'}</p>
                <p><strong>Elenco:</strong> {movie.atores || 'N/A'}</p>
                {/* Agora mostra a sinopse completa, sem cortar */}
                <p><strong>Sinopse:</strong> {movie.sinopse || 'N/A'}</p>
              </div>
              {/* --- FIM DA ATUALIZAÇÃO --- */}
              
              <div className="pending-actions">
                <button onClick={() => handleApprove(movie.id_filme)} className="approve-button">
                  Aprovar
                </button>
                <button onClick={() => handleDelete(movie.id_filme)} className="reject-button">
                  Rejeitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;