import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Bookmark, Check, Star, X } from 'lucide-react';

const FEATURED_SLIDES = [
  {
    id: 'featured-1',
    title: 'Той, хто біжить по лезу 2049',
    originalTitle: 'Blade Runner 2049',
    year: 2017,
    duration: '164 хв',
    rating: 8.0,
    tag: 'Вибір редакції',
    synopsis:
      'Офіцер поліції Лос-Анджелеса Кей розкриває давню таємницю, здатну занурити залишки суспільства в хаос, і вирушає на пошуки зниклого Ріка Декарда.',
    backdrop:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1800&auto=format&fit=crop',
    poster:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/gCcx85zbxz4?autoplay=1',
  },
  {
    id: 'featured-2',
    title: 'Інтерстеллар',
    originalTitle: 'Interstellar',
    year: 2014,
    duration: '169 хв',
    rating: 8.7,
    tag: 'Класика фантастики',
    synopsis:
      'Коли посуха та пилові бурі роблять Землю непридатною для життя, команда дослідників вирушає крізь червоточину в пошуках нового дому для людства.',
    backdrop:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1800&auto=format&fit=crop',
    poster:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1',
  },
  {
    id: 'featured-3',
    title: 'Дюна: Частина друга',
    originalTitle: 'Dune: Part Two',
    year: 2024,
    duration: '166 хв',
    rating: 8.6,
    tag: 'Прем’єра сезону',
    synopsis:
      'Пол Атрід об’єднується з фременами та Чані, щоб помститися змовникам, які знищили його родину, і зробити вибір між коханням і долею всесвіту.',
    backdrop:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1800&auto=format&fit=crop',
    poster:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1',
  },
];

export const PosterCarousel = ({
  allMedia = [],
  watchlist = [],
  onToggleWatchlist,
  onSelectMedia,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTrailer, setActiveTrailer] = useState(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? FEATURED_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === FEATURED_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const resolveMediaObject = (slide) => {
    const matched = allMedia.find(
      (m) =>
        (m.originalTitle &&
          m.originalTitle.toLowerCase() === slide.originalTitle.toLowerCase()) ||
        (m.title && m.title.toLowerCase() === slide.title.toLowerCase())
    );
    return matched || slide;
  };

  return (
    <div className="relative w-full h-[410px] sm:h-[470px] overflow-hidden bg-zinc-950">
      <div
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {FEATURED_SLIDES.map((slide) => {
          const mediaObj = resolveMediaObject(slide);
          const isInWatchlist = watchlist.some(
            (w) => String(w.id) === String(mediaObj.id)
          );

          return (
            <div key={slide.id} className="relative w-full h-full shrink-0">
              <img
                src={slide.backdrop}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/65 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-transparent to-zinc-950/35 pointer-events-none" />

              <div className="absolute inset-0 flex items-end pb-7 sm:pb-9">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="max-w-2xl space-y-3">
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-300">
                      <span className="px-2 py-0.5 rounded bg-yellow-400 text-zinc-950 font-bold uppercase tracking-wider text-[11px]">
                        {slide.tag}
                      </span>
                      <span className="inline-flex items-center gap-1 text-yellow-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        <span>IMDb {slide.rating.toFixed(1)}</span>
                      </span>
                      <span>•</span>
                      <span>{slide.year}</span>
                      <span>•</span>
                      <span>{slide.duration}</span>
                    </div>

                    <h1
                      onClick={() => onSelectMedia && onSelectMedia(mediaObj)}
                      className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight cursor-pointer hover:text-yellow-400 transition-colors"
                    >
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-[15px] text-zinc-200 leading-relaxed line-clamp-3 max-w-xl">
                      {slide.synopsis}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveTrailer(slide)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-yellow-400 text-zinc-950 text-sm font-bold hover:bg-yellow-300 transition-colors cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Трейлер</span>
                      </button>

                      {onToggleWatchlist && (
                        <button
                          type="button"
                          onClick={() => onToggleWatchlist(mediaObj)}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md border text-sm font-semibold backdrop-blur-sm transition-colors cursor-pointer ${
                            isInWatchlist
                              ? 'bg-white/15 border-yellow-400 text-white'
                              : 'bg-zinc-900/70 border-white/25 text-white hover:border-white/60'
                          }`}
                        >
                          {isInWatchlist ? (
                            <>
                              <Check className="w-4 h-4 text-yellow-400" />
                              <span>У списку</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-4 h-4" />
                              <span>У список</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-end">
                    <span className="font-mono text-xs text-zinc-300 mr-1">
                      0{currentIndex + 1} / 0{FEATURED_SLIDES.length}
                    </span>
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Попередній фільм"
                      className="p-2.5 rounded-md bg-zinc-900/80 border border-zinc-700 text-white hover:border-yellow-400 hover:text-yellow-400 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Наступний фільм"
                      className="p-2.5 rounded-md bg-zinc-900/80 border border-zinc-700 text-white hover:border-yellow-400 hover:text-yellow-400 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeTrailer && (
        <div
          onClick={() => setActiveTrailer(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-base text-white">
                  {activeTrailer.title}
                </h3>
                <span className="font-mono text-xs text-yellow-400">Трейлер</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTrailer(null)}
                className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={activeTrailer.trailerUrl}
                title={activeTrailer.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};