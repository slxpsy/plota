import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const CAROUSEL_ITEMS = [
  {
    id: 'c1',
    title: 'Blade Runner 2049',
    year: '2017',
    rating: '8.0',
    tag: 'FEATURED',
    bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'c2',
    title: 'Interstellar',
    year: '2014',
    rating: '8.7',
    tag: 'TOP RATED',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'c3',
    title: 'Dune: Part Two',
    year: '2024',
    rating: '8.6',
    tag: 'NEW RELEASE',
    bg: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop'
  }
];

export const PosterCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_ITEMS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === CAROUSEL_ITEMS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-64 sm:h-80 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md overflow-hidden shadow-xs">
      
      {/* Плавний слайдер 700ms ease-in-out */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {CAROUSEL_ITEMS.map((item) => (
          <div key={item.id} className="relative w-full h-full shrink-0">
            <img
              src={item.bg}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

            <div className="absolute bottom-5 left-6 right-28 z-10 space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-sans font-bold uppercase tracking-wider bg-dark-accent text-slate-950 rounded-xs">
                {item.tag}
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold uppercase tracking-wide text-white drop-shadow-md">
                {item.title} <span className="text-sm font-sans text-stone-300 font-medium">({item.year})</span>
              </h2>
              <div className="flex items-center gap-1.5 text-dark-imdb font-sans text-xs font-bold">
                <Star className="w-4 h-4 fill-dark-imdb text-dark-imdb" />
                <span>{item.rating} / 10</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопки перемикання */}
      <div className="absolute bottom-5 right-6 z-20 flex items-center gap-1.5">
        <button
          onClick={prevSlide}
          aria-label="Попередній слайд"
          className="p-2 bg-black/70 backdrop-blur-xs border border-white/20 text-white hover:bg-dark-accent hover:text-slate-950 rounded-xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Наступний слайд"
          className="p-2 bg-black/70 backdrop-blur-xs border border-white/20 text-white hover:bg-dark-accent hover:text-slate-950 rounded-xs transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};