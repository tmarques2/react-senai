// src/components/LoadingScreen/LoadingScreen.jsx
import React from 'react';
import './LoadingScreen.css';

// Importe sua logo (o mesmo do Header)
import logoImage from '../../assets/images/logo.png'; 

function LoadingScreen() {
  return (
    <div className="loading-container">
      <img 
        src={logoImage} 
        alt="THAFLIX Logo" 
        className="loading-logo" 
      />
      <span className="loading-text">Carregando...</span>
    </div>
  );
}

export default LoadingScreen;