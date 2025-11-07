import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import './BannerCarousel.css';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// banners
const bannerImages = [
  {
    id: 1,
    imageUrl: "https://i.pinimg.com/1200x/51/a7/1c/51a71c289b66efbd4bbd4abc96bd23f2.jpg"
  },
  {
    id: 2,
    imageUrl: "https://i.pinimg.com/736x/71/e3/d8/71e3d8e53ea730c06b9424341f362bfd.jpg"
  },
  {
    id: 3,
    imageUrl: "https://i.pinimg.com/736x/9b/c3/d1/9bc3d1c1cd018be19f265d1bc9ef28e9.jpg"
  },
  {
    id: 4,
    imageUrl: "https://i.pinimg.com/736x/3d/c3/d2/3dc3d26d02d666ab5b664c8d039f4b2f.jpg"
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

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Efeito para o autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, autoplaySpeed);

    // Limpa o timer quando o componente é desmontado
    return () => clearInterval(timer);
  }, [goToNext, autoplaySpeed]);

  // O componente <CarouselStyles /> foi removido daqui
  return (
    <div className="banner-carousel-container">
      {/* Slider */}
      <div
        className="carousel-slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((banner) => (
          <div key={banner.id} className="carousel-slide-item">
            <img
              src={banner.imageUrl}
              alt={banner.title || `Banner ${banner.id}`}
              className="carousel-slide-image"
            />
            <div className="carousel-slide-caption">
              <h3>{banner.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Setas */}
      <button className="carousel-arrow prev" onClick={goToPrev}>
        &#10094;
      </button>
      <button className="carousel-arrow next" onClick={goToNext}>
        &#10095;
      </button>

      {/* Pontos */}
      <div className="carousel-dots">
        {bannerImages.map((_, index) => (
          <div
            key={index}
            className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;