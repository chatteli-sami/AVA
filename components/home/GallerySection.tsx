"use client";

import { useState } from "react";
import { gallerySlides } from "./content";

export default function GallerySection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const nextSlide = () => setActiveSlide((index) => (index + 1) % gallerySlides.length);
  const prevSlide = () => setActiveSlide((index) => (index - 1 + gallerySlides.length) % gallerySlides.length);

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">L’Excellence visuelle</span>
          <div className="gold-line"></div>
          <p>Une immersion dans l’art de vivre raffiné qui vous attend</p>
        </div>

        <div className="gallery-carousel">
          <button type="button" className="carousel-nav prev" aria-label="Image précédente" onClick={prevSlide}><i className="fas fa-chevron-left" aria-hidden="true"></i></button>
          <button type="button" className="carousel-nav next" aria-label="Image suivante" onClick={nextSlide}><i className="fas fa-chevron-right" aria-hidden="true"></i></button>

          <div className="carousel-track" aria-live="polite" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            {gallerySlides.map((slide, index) => (
              <div className={`carousel-slide ${activeSlide === index ? "active" : ""}`} key={slide.title}>
                <img src={slide.src} alt={slide.alt} width={1600} height={900} loading="lazy" />
                <div className="slide-overlay">
                  <div className="slide-content">
                    <h3>{slide.title}</h3>
                    <span className="slide-number">{slide.number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gallery-thumbnails" aria-label="Vignettes">
          <div className="thumbnails-container">
            {gallerySlides.map((slide, index) => (
              <button
                type="button"
                key={slide.title}
                className={`thumbnail ${activeSlide === index ? "active" : ""}`}
                data-slide={index}
                aria-label={`Voir slide ${index + 1}`}
                aria-current={activeSlide === index ? "true" : undefined}
                onClick={() => setActiveSlide(index)}
              >
                <img src={slide.src} alt={slide.alt} width={180} height={110} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
