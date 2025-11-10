import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const [pendingMovies, setPendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { token, setPendingCount } = useAuth(); // Pegar o token e o setter

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
        setPendingCount(data.length); // Atualiza a contagem global
      } else {
        throw new Error(data.error || 'Erro ao buscar filmes pendentes');
      }
    } catch (err) {
      setError(err.message);
      setPendingCount(0); // Zera a contagem em caso de erro
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingMovies();
  }, [token]);

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
        fetchPendingMovies(); // Re-busca a lista (e atualiza a contagem)
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
        fetchPendingMovies(); // Re-busca a lista (e atualiza a contagem)
      }
    } catch (err) {
      alert('Erro ao deletar filme.');
    }
  };

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