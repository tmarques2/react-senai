// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout/MainLayout'; 
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// Importe suas páginas com React.lazy
const HomePage = React.lazy(() => import('./pages/Home/Home'));
const CatalogPage = React.lazy(() => import('./pages/Catalog/Catalog'));
const LoginPage = React.lazy(() => import('./pages/Login/LoginPage'));
const AddMoviePage = React.lazy(() => import('./pages/AddMovie/AddMoviePage'));

// <<< NOVO: Importe a nova página de Detalhes
const MovieDetailsPage = React.lazy(() => import('./pages/MovieDetails/MovieDetails'));

import './index.css'; 

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <div className="App">
          <Routes>
            {/* Rotas com Header (MainLayout) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/add-movie" element={<AddMoviePage />} />

              {/* <<< NOVO: Rota dinâmica para os detalhes do filme */}
              {/* O ':id' é um parâmetro que pegaremos na página */}
              <Route path="/filme/:id" element={<MovieDetailsPage />} />
              
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