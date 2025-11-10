import React, { useState, useEffect, useCallback } from 'react';
// Importação do CSS
import './BannerCarousel.css';

// Dados dos banners
// Em uma aplicação real, isso viria de uma API
const bannerImages = [
  {
    id: 1,
    imageUrl: "https://i.pinimg.com/1200x/51/a7/1c/51a71c289b66efbd4bbd4abc96bd23f2.jpg",
    title: "Banner 1"
  },
  {
    id: 2,
    imageUrl: "https://i.pinimg.com/736x/71/e3/d8/71e3d8e53ea730c06b9424341f362bfd.jpg",
    title: "Banner 2"
  },
  {
    id: 3,
    imageUrl: "https://i.pinimg.com/736x/9b/c3/d1/9bc3d1c1cd018be19f265d1bc9ef28e9.jpg",
    title: "Banner 3"
  },
  {
    id: 4,
    imageUrl: "https://i.pinimg.com/736x/3d/c3/d2/3dc3d26d02d666ab5b664c8d039f4b2f.jpg",
    title: "Banner 4"
  }
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplaySpeed = 5000;

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Efeito para o autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, autoplaySpeed);

    // Limpa o timer quando o componente é desmontado
    return () => clearInterval(timer);
  }, [goToNext, autoplaySpeed]);

  return (
    // Container principal usando a classe do CSS
    <section 
      className="bannerCarouselContainer"
      role="region"
      aria-label="Carrossel de Banners"
    >
      {/* Slider */}
      <div
        className="carouselSlider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((banner) => (
          <div key={banner.id} className="carouselSlideItem">
            <img
              src={banner.imageUrl}
              alt={banner.title || `Banner ${banner.id}`}
              className="carouselSlideImage"
              // Adiciona fallback de imagem
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x450/1a1a1a/f0f0f0?text=Imagem+Indisponivel"; }}
            />
          </div>
        ))}
      </div>

      {/* Setas de Navegação */}
      <button 
        className="carouselArrow prev" 
        onClick={goToPrev}
        aria-label="Slide anterior"
      >
        &#10094;
      </button>
      <button 
        className="carouselArrow next" 
        onClick={goToNext}
        aria-label="Próximo slide"
      >
        &#10095;
      </button>

      {/* Pontos de Navegação */}
      <div className="carouselDots">
        {bannerImages.map((_, index) => (
          <div
            key={index}
            // Classe dinâmica para o dot ativo
            className={`carouselDot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            role="button"
            aria-label={`Ir para o slide ${index + 1}`}
            tabIndex={0} // Permite focar com o teclado
            onKeyDown={(e) => e.key === 'Enter' && goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerCarousel;