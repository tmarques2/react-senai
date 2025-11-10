import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // 1. NOVO ESTADO PARA NOTIFICAÇÕES
  const [pendingCount, setPendingCount] = useState(0);

  // 2. NOVA FUNÇÃO para buscar a contagem
  const fetchPendingCount = async (authToken) => {
    try {
      const response = await fetch('http://localhost:8081/pendingcount', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!response.ok) return; // Não faz nada se der erro
      
      const data = await response.json();
      setPendingCount(data.count || 0);
    } catch (err) {
      console.error("Erro ao buscar contagem de notificações:", err);
    }
  };

  // 3. ATUALIZAÇÃO no useEffect (busca a contagem se o admin já estiver logado)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setToken(storedToken);
      
      if (userData.tipo === 'admin') {
        fetchPendingCount(storedToken);
      }
    }
  }, []);

  // 4. ATUALIZAÇÃO na função de login (busca a contagem ao logar como admin)
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);

    if (userData.tipo === 'admin') {
      fetchPendingCount(userToken);
    }
  };

  // 5. ATUALIZAÇÃO na função de logout (limpa a contagem)
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setPendingCount(0); // Limpa a contagem ao sair
  };

  const isAdmin = () => {
    return user && user.tipo === 'admin';
  };

  // 6. EXPÕE A CONTAGEM E A FUNÇÃO DE ATUALIZAR
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, pendingCount, setPendingCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};