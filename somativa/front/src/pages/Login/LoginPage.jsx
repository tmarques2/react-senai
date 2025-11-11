// src/pages/Login/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';
import logoImage from '../../assets/images/logo.png';

// Hooks de autenticação
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// IMPORTAR O SEU VÍDEO DE FUNDO
// Verifique se o caminho está correto para o seu ficheiro MP4
import backgroundVideo from '../../assets/videos/background-video.mp4'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simula um pequeno atraso de carregamento
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      login(data.user, data.token);
      
      if (data.user.tipo === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="login-page-container">
      {/* O ELEMENTO DE VÍDEO DE FUNDO */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src={backgroundVideo} type="video/mp4" />
        {/* Adicione outras fontes (ex: WEBM) se tiver para maior compatibilidade */}
        {/* <source src="seuvideo.webm" type="video/webm" /> */}
        O seu navegador não suporta vídeos de fundo.
      </video>

      <div className="login-box-wrapper">
        <div className="login-box-container">
          
          <img src={logoImage} alt="Logo THAIFLIX" className="login-logo" />
          
          <h2>Fazer Login</h2>
          
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite seu email" 
              />
            </div>

            <div className="input-group">
              <label htmlFor="senha">Senha</label>
              <input 
                type="password" 
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="Digite sua senha"
              />
            </div>

            {error && <p className="login-error">{error}</p>}
            
            <button type="submit" className="login-submit-button">
              Entrar
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;