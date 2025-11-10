import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import fundoLogin from '../../assets/images/fundo_login.svg?url';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function LoginPage() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 
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

  const showLogin = () => setIsLoginActive(true);
  const showCadastro = () => setIsLoginActive(false);
  const cardClassName = `card ${isLoginActive ? 'loginActive' : 'cadastroActive'}`;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <section 
      className="containerPaiLogin"
      style={{ '--fundo-login-url': `url(${fundoLogin})` }}
    >
      <div className={cardClassName}>
        <div className="esquerda">
          <div className="formLogin">
            <h2>Fazer Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <input 
                type="email" 
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              {error && <p className="login-error" style={{color: 'red', fontSize: '0.9rem'}}>{error}</p>}
              <button type="submit">Entrar</button>
            </form>
          </div>
          <div className="facaLogin">
            <h2>Já tem <br /> uma conta?</h2>
            <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
            <button className="loginButton" onClick={showLogin}>
              Faça Login
            </button>
          </div>
        </div>
        
        <div className="direita">
          <div className="formCadastro">
            <h2>Cadastro</h2>
            <form>
              <input type="text" placeholder="Nome" />
              <input type="email" placeholder="E-mail" />
              <input type="password" placeholder="Senha" />
              <input type="password" placeholder="Confirme sua Senha" />
              <button type="submit">Cadastrar</button>
            </form>
          </div>
          <div className="facaCadastro">
            <h2>Não tem <br /> uma conta?</h2>
            <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
            <button className="cadastroButton" onClick={showCadastro}>
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;