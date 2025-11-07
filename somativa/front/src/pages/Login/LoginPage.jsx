// src/pages/Login/LoginPage.jsx
import React, { useState, useEffect } from 'react'; // 1. Importe useEffect
import './LoginPage.css';
import fundoLogin from '../../assets/images/fundo_login.svg?url';

// 2. Importe a tela de loading
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen.jsx';

function LoginPage() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  
  // 3. Adicione o estado de loading
  const [isLoading, setIsLoading] = useState(true);

  // 4. Adicione o timer artificial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 1.5 segundos

    return () => clearTimeout(timer);
  }, []);

  const showLogin = () => setIsLoginActive(true);
  const showCadastro = () => setIsLoginActive(false);
  const cardClassName = `card ${isLoginActive ? 'loginActive' : 'cadastroActive'}`;

  // 5. Verificação de loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 6. Seu código original da página
  return (
    <section 
      className="containerPaiLogin"
      style={{ '--fundo-login-url': `url(${fundoLogin})` }}
    >
      <div className={cardClassName}>
        {/* LADO ESQUERDO */}
        <div className="esquerda">
          <div className="formLogin">
            <h2>Fazer Login</h2>
            <form>
              <input type="email" placeholder="E-mail" />
              <input type="password" placeholder="Senha" />
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
        {/* LADO DIREITO */}
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