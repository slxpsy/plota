import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Trash2, 
  Send, 
  User,
  Check,
  RotateCw,
  ListPlus,
  Users,
  Film
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MediaDetailPage = ({
  media,
  onBack,
  backLabel = 'Назад до каталогу',
  isFavorite,
  isWatchlist,
  onToggleFavorite,
  onToggleWatchlist,
  currentUser,
  onAddReviewGlobal,
  onDeleteReviewGlobal,
  allGlobalReviews = [],
  customLists = [],
  onToggleMediaInList
}) => {
  const { t, movieTitle, movieSynopsis, movieDuration, language } = useLanguage();
  const [rating, setRating] = useState(10);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isRewatch, setIsRewatch] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);

  // Ліміт відображення відгуків
  const [visibleCount, setVisibleCount] = useState(10);

  if (!media) return null;

  const movieReviews = (allGlobalReviews || []).filter(
    (r) => String(r.mediaId) === String(media.id)
  );

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    const newReview = {
      id: 'rev-' + Date.now(),
      mediaId: media.id,
      mediaTitle: media.title,
      mediaPoster: media.poster,
      userId: currentUser.id || currentUser.name,
      author: currentUser.name || 'Користувач',
      rating: Number(rating),
      text: commentText.trim(),
      isRewatch: isRewatch,
      date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    };

    onAddReviewGlobal(newReview);
    setCommentText('');
    setRating(10);
    setHoverRating(0);
    setIsRewatch(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 font-sans animate-fadeIn">
      
      {/* Кнопка Назад */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary hover:text-dark-accent transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{backLabel}</span>
      </button>

      {/* Головна картка фільму */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-md border border-light-border dark:border-dark-border p-5 sm:p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Постер */}
        <div className="relative aspect-[2/3] md:max-w-[280px] md:justify-self-center rounded-xs overflow-hidden bg-stone-900 border border-light-border dark:border-dark-border">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-stone-800 to-stone-950 p-4 text-center text-stone-300" aria-hidden="true">
            <Film className="h-8 w-8 text-dark-accent/80" />
            <span className="font-heading text-sm font-bold">{movieTitle(media)}</span>
          </div>
          <img
            src={media.poster}
            alt={movieTitle(media)}
            className="w-full h-full object-cover"
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
        </div>

        {/* Інформація */}
        <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-light-border dark:border-dark-border pb-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary tracking-wide">
                  {movieTitle(media)}
                </h1>
                {media.originalTitle && language !== 'en' && (
                  <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary italic">
                    {media.originalTitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 relative">
                {/* Улюблене */}
                <button
                  type="button"
                  onClick={() => onToggleFavorite(media)}
                  className={`p-2 rounded-xs border transition-colors cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-500'
                      : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-rose-500/50'
                  }`}
                  title={t('Улюблене')}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>

                {/* Збережене */}
                <button
                  type="button"
                  onClick={() => onToggleWatchlist(media)}
                  className={`p-2 rounded-xs border transition-colors cursor-pointer ${
                    isWatchlist
                      ? 'bg-dark-accent/10 border-dark-accent/40 text-dark-accent'
                      : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-dark-accent/50'
                  }`}
                  title={t('У збережених')}
                >
                  <Bookmark className={`w-4 h-4 ${isWatchlist ? 'fill-dark-accent' : ''}`} />
                </button>

                {/* Додати до персонального списку */}
                {currentUser && onToggleMediaInList && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowListMenu(!showListMenu)}
                      className="p-2 rounded-xs border bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-dark-accent/50 transition-colors cursor-pointer"
                      title={t('Додати до мого списку')}
                    >
                      <ListPlus className="w-4 h-4" />
                    </button>

                    {showListMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xs shadow-xl p-2 z-30 space-y-1">
                        <p className="text-[10px] font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary px-2 py-1">
                          {t('Мої добірки:')}
                        </p>
                        {customLists.length === 0 ? (
                          <p className="text-[11px] text-light-textSecondary dark:text-dark-textSecondary italic px-2 py-1">
                            {t('Спочатку створіть список у Профілі.')}
                          </p>
                        ) : (
                          customLists.map((list) => {
                            const isInList = list.items?.some((item) => String(item.id) === String(media.id));
                            return (
                              <button
                                key={list.id}
                                type="button"
                                onClick={() => onToggleMediaInList(list.id, media)}
                                className="w-full flex items-center justify-between text-left px-2 py-1.5 text-xs font-sans rounded-xs hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                              >
                                <span className="line-clamp-1">{list.title}</span>
                                {isInList && <Check className="w-3.5 h-3.5 text-dark-accent shrink-0" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
              <div className="flex items-center gap-1.5 text-dark-accent font-bold">
                <Star className="w-4 h-4 fill-dark-accent" />
                <span>IMDb {Number(media.rating).toFixed(1)}</span>
              </div>
              <span className="text-light-textSecondary dark:text-dark-textSecondary">•</span>
              <div className="flex items-center gap-1 text-light-textSecondary dark:text-dark-textSecondary">
                <Clock className="w-3.5 h-3.5" />
                <span>{movieDuration(media.duration)}</span>
              </div>
              <span className="text-light-textSecondary dark:text-dark-textSecondary">•</span>
              <span className="text-light-textSecondary dark:text-dark-textSecondary font-semibold">
                {media.year}
              </span>
            </div>

            {media.genres && (
              <div className="flex flex-wrap gap-1.5">
                {media.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-0.5 rounded-xs bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-[11px] font-sans font-medium text-light-textSecondary dark:text-dark-textSecondary"
                  >
                    {t(genre)}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs sm:text-sm text-light-textSecondary dark:text-dark-textSecondary leading-relaxed pt-2">
              {movieSynopsis(media)}
            </p>

            {/* СЕКЦІЯ КАСТУ (АКТОРСЬКИЙ СКЛАД) */}
            {media.cast?.length > 0 && (
              <div className="pt-3 border-t border-light-border dark:border-dark-border space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-light-textPrimary dark:text-dark-textPrimary">
                  <Users className="w-3.5 h-3.5 text-dark-accent" />
                  <span>{t('У головних ролях:')}</span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {media.cast.map((actor, idx) => (
                    <div
                      key={actor.id || idx}
                      className="flex items-center gap-2 p-1.5 rounded-xs bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border shrink-0"
                    >
                      {actor.photo ? (
                        <img
                          src={actor.photo}
                          alt={t(actor.name)}
                          className="w-7 h-7 rounded-full object-cover border border-light-border dark:border-dark-border"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-dark-accent/20 text-dark-accent font-bold text-[10px] flex items-center justify-center">
                          {actor.name.charAt(0)}
                        </div>
                      )}
                      <div className="text-[11px] font-sans leading-tight">
                        <p className="font-bold text-light-textPrimary dark:text-dark-textPrimary">
                          {t(actor.name)}
                        </p>
                        {actor.character && (
                          <p className="text-[10px] text-light-textSecondary dark:text-dark-textSecondary">
                          {t(actor.character)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Секція рецензій */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-md border border-light-border dark:border-dark-border p-5 sm:p-6 space-y-6 shadow-xs">
        
        <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-dark-accent" />
            <h2 className="text-base font-heading font-bold uppercase tracking-wider text-light-textPrimary dark:text-dark-textPrimary">
              {t('Рецензії та обговорення')}
            </h2>
          </div>
          <span className="text-xs font-sans text-light-textSecondary dark:text-dark-textSecondary">
            {t('Усього:')} <strong className="text-dark-accent font-bold">{movieReviews.length}</strong>
          </span>
        </div>

        {currentUser ? (
          <form onSubmit={handleSubmitReview} className="space-y-4 bg-light-bg dark:bg-dark-bg p-4 rounded-xs border border-light-border dark:border-dark-border">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-sans font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
                {t('Залишити свій відгук як')} <span className="text-dark-accent">{currentUser.name}</span>
              </span>

              {/* Зірочки оцінки */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-light-textSecondary dark:text-dark-textSecondary font-medium">
                  {t('Оцінка:')}
                </span>
                
                <div 
                  className="flex items-center gap-0.5"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starNum) => {
                    const isLit = (hoverRating || rating) >= starNum;
                    return (
                      <button
                        key={starNum}
                        type="button"
                        onClick={() => setRating(starNum)}
                        onMouseEnter={() => setHoverRating(starNum)}
                        className="p-0.5 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                        title={`${starNum} з 10`}
                      >
                        <Star
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                            isLit
                              ? 'fill-dark-accent text-dark-accent'
                              : 'text-light-border dark:text-dark-border fill-transparent'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-heading font-bold text-dark-accent min-w-[36px] text-right">
                  {hoverRating || rating}/10
                </span>
              </div>
            </div>

            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t('Поділіться вашими враженнями від перегляду...')}
              className="w-full p-2.5 text-xs font-sans bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xs text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-dark-accent transition-colors resize-none"
            />

            {/* Кастомний чип Rewatch + Надіслати */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              
              <button
                type="button"
                onClick={() => setIsRewatch(!isRewatch)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xs border text-xs font-sans font-medium transition-all cursor-pointer select-none ${
                  isRewatch
                    ? 'bg-dark-accent/15 border-dark-accent text-dark-accent font-bold'
                    : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-dark-accent/50'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-2xs border flex items-center justify-center transition-colors ${
                  isRewatch
                    ? 'bg-dark-accent border-dark-accent text-slate-950'
                    : 'border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg'
                }`}>
                  {isRewatch && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <RotateCw className={`w-3.5 h-3.5 transition-transform duration-200 ${isRewatch ? 'rotate-180 text-dark-accent' : ''}`} />
                <span>{t('Повторний перегляд (Rewatch)')}</span>
              </button>

              <div className="flex items-center gap-3">
                {showSuccess && (
                  <span className="text-xs text-emerald-500 font-sans font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {t('Опубліковано!')}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xs bg-dark-accent text-slate-950 text-xs font-sans font-bold uppercase hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>{t('Надіслати')}</span>
                </button>
              </div>

            </div>
          </form>
        ) : (
          <div className="p-4 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xs text-center space-y-1">
            <p className="text-xs font-sans font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
              {t('Бажаєте залишити рецензію?')}
            </p>
            <p className="text-[11px] text-light-textSecondary dark:text-dark-textSecondary">
              {t('Увійдіть у свій акаунт, щоб мати можливість оцінювати фільми та писати коментарі.')}
            </p>
          </div>
        )}

        {/* Список опублікованих відгуків з пагінацією */}
        <div className="space-y-3">
          {movieReviews.length === 0 ? (
            currentUser && (
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary italic py-4 text-center">
                {t('Поки немає жодної рецензії. Будьте першим, хто залишить відгук!')}
              </p>
            )
          ) : (
            <>
              {movieReviews.slice(0, visibleCount).map((review) => {
                const isMyReview = Boolean(
                  currentUser && (
                    (currentUser.id && String(review.userId) === String(currentUser.id)) || 
                    (currentUser.name && review.author === currentUser.name)
                  )
                );

                return (
                  <div
                    key={review.id}
                    className="p-3.5 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-dark-accent/20 border border-dark-accent/40 flex items-center justify-center text-dark-accent">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-sans font-bold text-light-textPrimary dark:text-dark-textPrimary">
                          {review.author}
                        </span>

                        {review.isRewatch && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-dark-accent/10 border border-dark-accent/30 text-dark-accent text-[10px] font-sans font-bold uppercase">
                            <RotateCw className="w-2.5 h-2.5" /> Rewatch
                          </span>
                        )}

                        <span className="text-[10px] text-light-textSecondary dark:text-dark-textSecondary font-sans">
                          • {review.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs font-bold text-dark-accent">
                          <Star className="w-3.5 h-3.5 fill-dark-accent" />
                          <span>{review.rating}/10</span>
                        </div>

                        {isMyReview && (
                          <button
                            type="button"
                            onClick={() => onDeleteReviewGlobal(review.id)}
                            title={t('Видалити свій відгук')}
                            className="p-1 text-light-textSecondary dark:text-dark-textSecondary hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed pl-8">
                      {review.text}
                    </p>
                  </div>
                );
              })}

              {movieReviews.length > visibleCount && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    className="px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-xs border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-textPrimary dark:text-dark-textPrimary hover:border-dark-accent transition-colors cursor-pointer"
                  >
                    {t('Показати ще')} ({movieReviews.length - visibleCount})
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
};
