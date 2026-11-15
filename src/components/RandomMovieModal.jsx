import React, { useState, useMemo } from 'react';
import { Dice5, X, ArrowRight, RefreshCw, Star, Clock, Sparkles, SlidersHorizontal, Film } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ROULETTE_VIBES = [
  { id: 'all', label: 'Усі вайби', kw: '' },
  { id: 'rainy', label: 'Rainy Night / Lo-Fi', kw: 'дощ' },
  { id: 'noir', label: 'Morally Grey / Нуар', kw: 'нуар' },
  { id: 'drama', label: 'Slow Burn', kw: 'драма' },
  { id: 'psych', label: 'Mind Games', kw: 'психологічний' },
  { id: 'thriller', label: 'Mindfuck / Plot Twist', kw: 'трилер' },
  { id: 'cozy', label: 'Cozy & Nostalgic', kw: 'меланхолія' },
  { id: 'family', label: 'Found Family / Пригоди', kw: 'пригоди' },
];

const DURATION_FILTERS = [
  { id: 'any', label: 'Будь-яка' },
  { id: 'short', label: '< 90 хв' },
  { id: 'medium', label: '90 – 120 хв' },
  { id: 'long', label: '120+ хв' },
];

// Універсальний парсер хвилин з будь-якого текстового рядка
const parseDurationInMinutes = (durationStr) => {
  if (!durationStr) return 0;
  const nums = String(durationStr).match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  if (nums.length === 1) return parseInt(nums[0], 10);
  if (nums.length >= 2) return parseInt(nums[0], 10) * 60 + parseInt(nums[1], 10);
  return 0;
};

export const RandomMovieModal = ({ isOpen, onClose, mediaList = [], onSelectMedia }) => {
  const { t, movieTitle, movieSynopsis, movieDuration } = useLanguage();
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('any');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Фільтрація списку під обраний вайб ТА тривалість
  const pool = useMemo(() => {
    if (!Array.isArray(mediaList) || mediaList.length === 0) return [];
    
    return mediaList.filter((item) => {
      // 1. Фільтр вайбу
      const activeVibe = ROULETTE_VIBES.find((v) => v.id === selectedVibe);
      let matchesVibe = true;
      if (activeVibe && activeVibe.kw) {
        const kw = activeVibe.kw.toLowerCase();
        const inMood = item?.mood && item.mood.toLowerCase().includes(kw);
        const inGenres = item?.genres && item.genres.some((g) => g.toLowerCase().includes(kw));
        const inSynopsis = item?.synopsis && item.synopsis.toLowerCase().includes(kw);
        matchesVibe = inMood || inGenres || inSynopsis;
      }

      // 2. Фільтр тривалості
      let matchesDuration = true;
      const mins = parseDurationInMinutes(item?.duration);
      if (selectedDuration === 'short') matchesDuration = mins > 0 && mins < 90;
      else if (selectedDuration === 'medium') matchesDuration = mins >= 90 && mins <= 120;
      else if (selectedDuration === 'long') matchesDuration = mins > 120;

      return matchesVibe && matchesDuration;
    });
  }, [mediaList, selectedVibe, selectedDuration]);

  const handleSpin = (currentPool = pool) => {
    if (!currentPool || currentPool.length === 0) {
      setSelectedMovie(null);
      return;
    }

    setHasStarted(true);
    setIsSpinning(true);
    
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * currentPool.length);
      setSelectedMovie(currentPool[randomIndex]);
      counter++;

      if (counter > 10) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 70);
  };

  const handleVibeChange = (vibeId) => {
    setSelectedVibe(vibeId);
    setSelectedMovie(null);
    setHasStarted(false);
  };

  const handleDurationChange = (durId) => {
    setSelectedDuration(durId);
    setSelectedMovie(null);
    setHasStarted(false);
  };

  const handleClose = () => {
    setSelectedMovie(null);
    setHasStarted(false);
    setSelectedVibe('all');
    setSelectedDuration('any');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-5 sm:p-7 space-y-5 shadow-2xl">
        
        {/* Кнопка закриття */}
        <button
          onClick={handleClose}
          type="button"
          aria-label={t('Закрити Movie Hunter')}
          className="absolute top-5 right-5 rounded-md p-1 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Заголовок */}
        <div className="flex items-center gap-3 border-b border-light-border dark:border-dark-border pb-4 pr-9">
          <Dice5 className="w-6 h-6 shrink-0 text-dark-accent" />
          <h2 className="text-lg sm:text-xl font-heading font-bold uppercase tracking-wider text-light-textPrimary dark:text-dark-textPrimary">
            {t('Movie Hunter — Пошук наосліп')}
          </h2>
        </div>

        {/* Налаштування вайбу та тривалості */}
        <div className="space-y-4">
          
          {/* Вибір вайбу */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-dark-accent" />
                <span>{t('Категорія або вайб:')}</span>
              </span>
              <span className="text-dark-accent font-semibold">({pool.length} {t('фільмів')})</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {ROULETTE_VIBES.map((vibe) => {
                const isSelected = selectedVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => handleVibeChange(vibe.id)}
                    className={`px-3 py-1.5 text-xs font-sans font-medium rounded-sm border transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent ${
                      isSelected
                        ? 'bg-dark-accent text-slate-950 border-dark-accent font-bold'
                        : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-dark-accent/60 hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
                    }`}
                  >
                    {t(vibe.label)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Вибір тривалості */}
          <div className="space-y-2 pt-3 border-t border-light-border dark:border-dark-border">
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary pt-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-dark-accent" />
              <span>{t('Тривалість фільму:')}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {DURATION_FILTERS.map((dur) => {
                const isSelected = selectedDuration === dur.id;
                return (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => handleDurationChange(dur.id)}
                    className={`px-3 py-1.5 text-xs font-sans font-medium rounded-sm border transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent ${
                      isSelected
                        ? 'bg-dark-accent text-slate-950 border-dark-accent font-bold'
                        : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-dark-accent/60 hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
                    }`}
                  >
                    {t(dur.label)}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Результат або запрошення до запуску */}
        {!hasStarted ? (
          <div className="min-h-40 flex flex-col items-center justify-center text-center py-6 px-5 bg-light-bg dark:bg-dark-bg rounded-sm border border-dashed border-light-border dark:border-dark-border space-y-3">
            <div className="w-12 h-12 rounded-full bg-dark-accent/10 border border-dark-accent/30 flex items-center justify-center text-dark-accent">
              <Dice5 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
                {t('Підберемо фільм для перегляду')}
              </p>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                {t('Залиште всі вайби або звузьте пошук до свого настрою.')}
              </p>
            </div>
          </div>
        ) : selectedMovie ? (
          <div className="space-y-3 pt-1">
            <div className={`relative ${selectedMovie.backdrop ? 'aspect-[2.2/1] max-h-[32vh]' : 'aspect-[2/3] max-h-[32vh] max-w-[220px]'} rounded-xs overflow-hidden border border-light-border dark:border-dark-border bg-stone-900 transition-all duration-150 ${isSpinning ? 'opacity-60 scale-98 blur-[1px]' : 'opacity-100 scale-100'}`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-stone-300" aria-hidden="true">
                <Film className="h-8 w-8 text-dark-accent/80" />
                <span className="font-heading text-sm font-bold">{movieTitle(selectedMovie)}</span>
              </div>
              <img
                src={selectedMovie.backdrop || selectedMovie.poster}
                alt={movieTitle(selectedMovie)}
                className="w-full h-full object-cover"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-3.5">
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-dark-accent uppercase mb-0.5">
                  <Star className="w-3 h-3 fill-dark-accent" />
                  <span>IMDb {selectedMovie.rating}</span>
                  {selectedMovie.duration && (
                    <>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                  <span>{movieDuration(selectedMovie.duration)}</span>
                    </>
                  )}
                </div>
                <h3 className="text-base font-heading font-bold uppercase text-white leading-tight">
                  {movieTitle(selectedMovie)}
                </h3>
              </div>
            </div>

            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary line-clamp-2 leading-relaxed">
              {movieSynopsis(selectedMovie)}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 bg-light-bg dark:bg-dark-bg rounded-xs border border-light-border dark:border-dark-border space-y-1">
            <p className="text-xs font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
              {t('Немає фільмів за такими параметрами')}
            </p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              {t('Спробуйте розширити вибір тривалості або вайбів.')}
            </p>
          </div>
        )}

        {/* Кнопки дій */}
        <div className="pt-1">
          {!hasStarted ? (
            <button
              type="button"
              onClick={() => handleSpin()}
              disabled={pool.length === 0}
              className="w-full min-h-12 flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-dark-accent text-slate-950 text-sm font-sans font-bold uppercase hover:brightness-105 transition-[filter] cursor-pointer disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent"
            >
              <Dice5 className="w-4 h-4" />
              <span>{t('Запустити Movie Hunter')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSpin()}
                disabled={isSpinning || pool.length === 0}
                className="flex-1 min-h-11 flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-xs font-sans font-bold uppercase hover:border-dark-accent transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{t('Перекрутити')}</span>
              </button>

              {selectedMovie && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectMedia(selectedMovie);
                    handleClose();
                  }}
                className="flex-1 min-h-11 flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm bg-dark-accent text-slate-950 text-xs font-sans font-bold uppercase hover:brightness-105 transition-[filter] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent"
                >
                  <span>{t('Перейти')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
