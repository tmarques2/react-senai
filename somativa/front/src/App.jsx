// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout/MainLayout'; 
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// --- IMPORTE OS NOVOS COMPONENTES DE ROTA ---
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoutes/AdminRoute.jsx';
// --- FIM DOS IMPORTS ---

const HomePage = React.lazy(() => import('./pages/Home/Home'));
const CatalogPage = React.lazy(() => import('./pages/Catalog/Catalog'));
const LoginPage = React.lazy(() => import('./pages/Login/LoginPage'));
const AddMoviePage = React.lazy(() => import('./pages/AddMovie/AddMoviePage'));
const MovieDetailsPage = React.lazy(() => import('./pages/MovieDetails/MovieDetails'));
const EditMoviePage = React.lazy(() => import('./pages/EditMovie/EditMovie'));

// --- IMPORTE A NOVA PÁGINA DE ADMIN ---
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard/AdminDashboard'));
// --- FIM DO IMPORT ---

import './index.css'; 

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <div className="App">
          <Routes>
            {/* Rotas Públicas com Header (MainLayout) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/filme/:id" element={<MovieDetailsPage />} />
            </Route>
            
            {/* Rota de Login (Pública, sem Header) */}
            <Route path="/login" element={<LoginPage />} />

            {/* --- ROTAS PROTEGIDAS (SÓ PARA USUÁRIOS LOGADOS) --- */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/add-movie" element={<AddMoviePage />} />
                {/* Outras rotas que só logado pode ver, ex: /perfil */}
              </Route>
            </Route>
            
            {/* --- ROTAS ADMIN (SÓ PARA ADMINS LOGADOS) --- */}
            <Route element={<AdminRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/editar/:id" element={<EditMoviePage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>
            
          </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;