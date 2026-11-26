import { useEffect, useRef } from 'react';
import Carousel from 'bootstrap/js/dist/carousel.js';
import { Link } from 'react-router-dom';

export default function PhotoCarousel({ id, label, className = '', slides }) {
  const carouselRef = useRef(null);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return undefined;

    const carousel = Carousel.getOrCreateInstance(element, {
      interval: 6500,
      keyboard: true,
      pause: 'hover',
      ride: false,
      touch: true,
      wrap: true,
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      carousel.cycle();
    }

    return () => carousel.dispose();
  }, []);

  return (
    <div
      ref={carouselRef}
      id={id}
      className={`carousel slide theme-carousel ${className}`}
      role="region"
      aria-label={label}
      aria-roledescription="carrusel"
    >
      <div className="carousel-indicators">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-label={`Mostrar imagen ${index + 1}: ${slide.title}`}
            aria-current={index === 0 ? 'true' : undefined}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            className={`carousel-item${index === 0 ? ' active' : ''}`}
            key={slide.title}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="carousel-caption">
              <span>{slide.eyebrow}</span>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              {slide.to && slide.action && (
                <Link to={slide.to}>{slide.action}</Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
        aria-label="Imagen anterior"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
        aria-label="Imagen siguiente"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
      </button>
    </div>
  );
}
