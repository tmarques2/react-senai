import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // 1. Ref para guardar o ID do nosso timer (Interval)
  const pollingIntervalRef = useRef(null);

  // Função para buscar a contagem (sem alterações)
  const fetchPendingCount = async (authToken) => {
    try {
      const response = await fetch('http://localhost:8081/pendingcount', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!response.ok) return; 
      
      const data = await response.json();
      setPendingCount(data.count || 0);
    } catch (err) {
      console.error("Erro ao buscar contagem de notificações:", err);
    }
  };

  // 2. Função para parar o polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // 3. Função para iniciar o polling
  const startPolling = (authToken) => {
    // Para garantir, para qualquer polling antigo
    stopPolling();
    
    // Inicia um novo polling que corre a cada 15 segundos
    pollingIntervalRef.current = setInterval(() => {
      console.log("Polling: A verificar notificações..."); // (Pode remover isto mais tarde)
      fetchPendingCount(authToken);
    }, 15000); // 15000 ms = 15 segundos
  };


  // 4. ATUALIZAÇÃO no useEffect (para utilizadores já logados)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setToken(storedToken);
      
      if (userData.tipo === 'admin') {
        fetchPendingCount(storedToken); // Busca a contagem 1 vez
        startPolling(storedToken);    // Começa a verificar a cada 15s
      }
    }

    // Limpa o timer se o componente for "desmontado"
    return () => {
      stopPolling();
    };
  }, []);

  // 5. ATUALIZAÇÃO na função de login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);

    if (userData.tipo === 'admin') {
      fetchPendingCount(userToken); // Busca a contagem 1 vez
      startPolling(userToken);    // Começa a verificar a cada 15s
    }
  };

  // 6. ATUALIZAÇÃO na função de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setPendingCount(0); 
    stopPolling(); // <<< IMPORTANTE: Para o timer
  };

  const isAdmin = () => {
    return user && user.tipo === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, pendingCount, setPendingCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};