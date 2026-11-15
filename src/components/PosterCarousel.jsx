import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Play, Bookmark, Check, Star, X, Film } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { t, movieTitle, movieSynopsis, movieDuration } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [transitioningIndex, setTransitioningIndex] = useState(null);

  const slides = useMemo(
    () =>
      FEATURED_SLIDES.map((featured) => {
        const media = allMedia.find(
          (item) =>
            item.originalTitle?.toLowerCase() === featured.originalTitle.toLowerCase() ||
            item.title?.toLowerCase() === featured.title.toLowerCase()
        );

        // Catalog data wins, so real poster/backdrop URLs can replace the demo assets.
        return media
          ? {
              ...featured,
              ...media,
              tag: featured.tag,
              trailerUrl: featured.trailerUrl,
              // Keep the curated Ukrainian display title even when catalog titles are in English.
              title: featured.title,
              originalTitle: media.originalTitle || featured.originalTitle,
              poster: media.poster || featured.poster,
              backdrop: media.backdrop || featured.backdrop,
              synopsis: media.synopsis || featured.synopsis,
              duration: media.duration || featured.duration,
              year: media.year || featured.year,
              rating: media.rating ?? featured.rating,
            }
          : featured;
      }),
    [allMedia]
  );

  const currentSlide = slides[currentIndex] || slides[0];
  const isInWatchlist = watchlist.some((item) => String(item.id) === String(currentSlide?.id));

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setTransitioningIndex(index);
    window.setTimeout(() => {
      setTransitioningIndex((activeIndex) => (activeIndex === index ? null : activeIndex));
    }, 220);
  };

  const prevSlide = () => goToSlide(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);

  const nextSlide = () => {
    goToSlide(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  if (!currentSlide) return null;

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#080b11] text-white">
      {/* Keep the hero dark in both site themes, so white copy stays readable over every image. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_38%,rgba(234,179,8,0.12),transparent_38%),linear-gradient(110deg,#080b11_4%,#101722_55%,#17150e_100%)]" />
      <div
        key={currentSlide.id}
        className={`absolute inset-0 -z-10 bg-cover bg-center opacity-35 ${transitioningIndex === currentIndex ? 'carousel-backdrop-enter' : ''}`}
        style={{ backgroundImage: currentSlide.backdrop ? `url("${currentSlide.backdrop}")` : undefined }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080b11]/95 via-[#080b11]/75 to-[#080b11]/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080b11] via-transparent to-[#080b11]/20" />

      <div className="mx-auto flex min-h-[540px] max-w-6xl flex-col justify-center px-4 pb-24 pt-14 sm:px-6 md:min-h-[570px] md:pb-28 md:pt-16">
        <div
          key={currentSlide.id}
          className={`grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_230px] lg:gap-16 ${transitioningIndex === currentIndex ? 'carousel-slide-enter' : ''}`}
        >
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-zinc-300 sm:text-sm">
              <span className="rounded bg-yellow-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-950">
                {t(currentSlide.tag)}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-yellow-400">
                <Star className="h-3.5 w-3.5 fill-current" /> IMDb {Number(currentSlide.rating).toFixed(1)}
              </span>
              <span aria-hidden="true">•</span>
              <span>{currentSlide.year}</span>
              <span aria-hidden="true">•</span>
              <span>{movieDuration(currentSlide.duration)}</span>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium tracking-wide text-zinc-300 sm:text-sm">
                {currentSlide.genres?.slice(0, 2).map((genre) => t(genre)).join(' · ') || t(currentSlide.tag)}
              </p>
              <h1
                onClick={() => onSelectMedia?.(currentSlide)}
                className="cursor-pointer text-4xl font-extrabold leading-[1.08] tracking-tight text-white transition-colors hover:text-yellow-300 sm:text-5xl lg:text-6xl"
              >
                {movieTitle(currentSlide)}
              </h1>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-zinc-200 sm:text-base sm:leading-7 line-clamp-3">
              {movieSynopsis(currentSlide)}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveTrailer(currentSlide)}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{t('Трейлер')}</span>
              </button>

              {onToggleWatchlist && (
                <button
                  type="button"
                  onClick={() => onToggleWatchlist(currentSlide)}
                  aria-pressed={isInWatchlist}
                  className={`inline-flex min-h-12 items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 ${
                    isInWatchlist
                      ? 'border-yellow-400 bg-white/15'
                      : 'border-white/25 bg-zinc-900/65 hover:border-white/60 hover:bg-zinc-900/85'
                  }`}
                >
                  {isInWatchlist ? <Check className="h-4 w-4 text-yellow-400" /> : <Bookmark className="h-4 w-4" />}
                  <span>{isInWatchlist ? t('У списку') : t('У список')}</span>
                </button>
              )}
              {onSelectMedia && (
                <button
                  type="button"
                  onClick={() => onSelectMedia(currentSlide)}
                  className="inline-flex min-h-12 items-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-yellow-300/70 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                >
                  {t('Детальніше')}
                </button>
              )}
            </div>
          </div>

          <div className="hidden justify-self-center md:block">
            <article className="relative flex h-[330px] w-[220px] flex-col overflow-hidden rounded-2xl border border-yellow-400/30 bg-zinc-900/80 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 lg:h-[360px] lg:w-[240px]">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-black/50" />
              {currentSlide.poster && (
                <img
                  key={currentSlide.poster}
                  src={currentSlide.poster}
                  alt={`${t('Постер фільму')} «${movieTitle(currentSlide)}»`}
                  className="absolute inset-0 h-full w-full object-cover opacity-85"
                  onError={(event) => { event.currentTarget.style.display = 'none'; }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/20" />
              <div className="relative flex h-full flex-col justify-between p-4">
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <Film className="h-4 w-4 text-yellow-400" />
                  <span>{currentSlide.year}</span>
                </div>
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-bold leading-tight text-white">{movieTitle(currentSlide)}</h2>
                  <p className="text-sm text-zinc-300">
                    {currentSlide.genres?.slice(0, 2).map((genre) => t(genre)).join(' · ') || t(currentSlide.tag)}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-white/20 pt-3 text-xs">
                  <span className="font-semibold text-yellow-400">IMDb {Number(currentSlide.rating).toFixed(1)}</span>
                  <span className="text-zinc-300">{movieDuration(currentSlide.duration)}</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-white/15 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-2" aria-label={`${t('Слайд')} ${currentIndex + 1} ${t('із')} ${slides.length}`}>
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`${t('Показати слайд')} ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-9 bg-yellow-400' : 'w-2 bg-white/30 hover:bg-white/60'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="mr-1 font-mono text-xs text-zinc-300 sm:text-sm">
                {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={prevSlide}
                aria-label={t('Попередній фільм')}
                className="rounded-xl border border-white/20 bg-black/35 p-2.5 text-white transition-colors hover:border-yellow-400 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label={t('Наступний фільм')}
                className="rounded-xl border border-white/20 bg-black/35 p-2.5 text-white transition-colors hover:border-yellow-400 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTrailer && createPortal(
        <div
          onClick={() => setActiveTrailer(null)}
          role="presentation"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${t('Трейлер:')} ${movieTitle(activeTrailer)}`}
            className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white">{movieTitle(activeTrailer)}</h3>
                <span className="font-mono text-xs text-yellow-400">{t('Трейлер')}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTrailer(null)}
                aria-label={t('Закрити трейлер')}
                className="rounded p-1 text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={activeTrailer.trailerUrl}
                title={`${t('Трейлер:')} ${movieTitle(activeTrailer)}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
