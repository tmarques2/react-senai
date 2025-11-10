import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// 1. Importe o AuthProvider
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Envolva o <App /> com o <AuthProvider /> */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);