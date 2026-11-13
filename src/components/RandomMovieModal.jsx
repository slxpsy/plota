import React, { useState, useMemo } from 'react';
import { Dice5, X, ArrowRight, RefreshCw, Star, Clock, Sparkles, SlidersHorizontal } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md p-5 space-y-4 shadow-2xl">
        
        {/* Кнопка закриття */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Заголовок */}
        <div className="flex items-center gap-2 border-b border-light-border dark:border-dark-border pb-3">
          <Dice5 className="w-5 h-5 text-dark-accent" />
          <h2 className="text-base font-heading font-bold uppercase tracking-wider text-light-textPrimary dark:text-dark-textPrimary">
            Movie Hunter — Пошук наосліп
          </h2>
        </div>

        {/* Налаштування вайбу та тривалості */}
        <div className="space-y-3">
          
          {/* Вибір вайбу */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-dark-accent" />
                <span>Категорія або вайб:</span>
              </span>
              <span className="text-dark-accent font-semibold">({pool.length} фільмів)</span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar pt-1">
              {ROULETTE_VIBES.map((vibe) => {
                const isSelected = selectedVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => handleVibeChange(vibe.id)}
                    className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-xs border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-dark-accent text-slate-950 border-transparent font-bold'
                        : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-dark-accent/50'
                    }`}
                  >
                    {vibe.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Вибір тривалості */}
          <div className="space-y-1.5 pt-1 border-t border-light-border dark:border-dark-border">
            <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary pt-1">
              <SlidersHorizontal className="w-3 h-3 text-dark-accent" />
              <span>Тривалість фільму:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DURATION_FILTERS.map((dur) => {
                const isSelected = selectedDuration === dur.id;
                return (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => handleDurationChange(dur.id)}
                    className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-xs border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-dark-accent/20 text-dark-accent border-dark-accent font-bold'
                        : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-dark-accent/50'
                    }`}
                  >
                    {dur.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Результат або запрошення до запуску */}
        {!hasStarted ? (
          <div className="text-center py-8 px-4 bg-light-bg dark:bg-dark-bg rounded-xs border border-dashed border-light-border dark:border-dark-border space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-dark-accent/10 border border-dark-accent/30 flex items-center justify-center text-dark-accent">
              <Dice5 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
                Готові полювати на кіно?
              </p>
              <p className="text-[11px] text-light-textSecondary dark:text-dark-textSecondary mt-0.5">
                Виберіть вайб та тривалість і тисніть кнопку запуску.
              </p>
            </div>
          </div>
        ) : selectedMovie ? (
          <div className="space-y-3 pt-1">
            <div className={`relative aspect-video rounded-xs overflow-hidden border border-light-border dark:border-dark-border transition-all duration-150 ${isSpinning ? 'opacity-60 scale-98 blur-[1px]' : 'opacity-100 scale-100'}`}>
              <img
                src={selectedMovie.backdrop || selectedMovie.poster}
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-3.5">
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold text-dark-accent uppercase mb-0.5">
                  <Star className="w-3 h-3 fill-dark-accent" />
                  <span>IMDb {selectedMovie.rating}</span>
                  {selectedMovie.duration && (
                    <>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{selectedMovie.duration}</span>
                    </>
                  )}
                </div>
                <h3 className="text-base font-heading font-bold uppercase text-white leading-tight">
                  {selectedMovie.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary line-clamp-2 leading-relaxed">
              {selectedMovie.synopsis}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 bg-light-bg dark:bg-dark-bg rounded-xs border border-light-border dark:border-dark-border space-y-1">
            <p className="text-xs font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
              Немає фільмів за такими параметрами
            </p>
            <p className="text-[11px] text-light-textSecondary dark:text-dark-textSecondary">
              Спробуйте розширити вибір тривалості або вайбу.
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xs bg-dark-accent text-slate-950 text-xs font-sans font-bold uppercase hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              <Dice5 className="w-4 h-4" />
              <span>Запустити Movie Hunter</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSpin()}
                disabled={isSpinning || pool.length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xs border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-xs font-sans font-bold uppercase hover:border-dark-accent transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>Перекрутити</span>
              </button>

              {selectedMovie && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectMedia(selectedMovie);
                    handleClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xs bg-dark-accent text-slate-950 text-xs font-sans font-bold uppercase hover:opacity-90 transition-opacity cursor-pointer font-bold"
                >
                  <span>Перейти</span>
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