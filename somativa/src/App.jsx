// src/App.jsx
import React, { Suspense } from 'react'; // 1. Importe o Suspense
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 2. Importe seu componente de layout e a tela de loading
import MainLayout from './components/MainLayout/MainLayout'; 
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// 3. Importe todas as suas páginas usando React.lazy
//    Isso diz ao React para não carregar o código da página
//    até que seja necessário.
const HomePage = React.lazy(() => import('./pages/Home/Home'));
const CatalogPage = React.lazy(() => import('./pages/Catalog/Catalog'));
const LoginPage = React.lazy(() => import('./pages/Login/LoginPage'));
const AddMoviePage = React.lazy(() => import('./pages/AddMovie/AddMoviePage'));

import './index.css'; 

function App() {
  return (
    <BrowserRouter>
      {/* 4. Envolva TUDO dentro do <Suspense>
          O 'fallback' é o que será mostrado durante a troca de página.
      */}
      <Suspense fallback={<LoadingScreen />}>
        <div className="App">
          <Routes>
            {/* Rotas com Header */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/add-movie" element={<AddMoviePage />} />
            </Route>
            
            {/* Rota sem Header */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;