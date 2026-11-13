import React, { useState } from 'react';
import { 
  Calendar, 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Star, 
  Trash2, 
  Film, 
  ListFilter, 
  Plus, 
  Download, 
  Upload, 
  X,
  RotateCw 
} from 'lucide-react';
import { MediaCard } from './MediaCard';

const parseDurationInMinutes = (durationStr) => {
  if (!durationStr) return 0;
  const nums = String(durationStr).match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  if (nums.length === 1) return parseInt(nums[0], 10);
  if (nums.length >= 2) return parseInt(nums[0], 10) * 60 + parseInt(nums[1], 10);
  return 0;
};

export const ProfilePage = ({
  user,
  favoriteMedia = [],
  watchlistMedia = [],
  userReviews = [],
  onSelectMedia,
  onDeleteReviewGlobal,
  allMedia = [],
  customLists = [],
  onCreateList,
  onDeleteList,
  onRemoveFromList,
  onExportUserData,
  onImportUserData
}) => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  // Ліміт відображення власних рецензій у профілі
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(10);

  if (!user) return null;

  // Розрахунок часу перегляду
  const allUserMediaMap = new Map();
  [...favoriteMedia, ...watchlistMedia].forEach((item) => {
    if (item && item.id) {
      allUserMediaMap.set(String(item.id), item);
    }
  });

  let totalMinutes = 0;
  allUserMediaMap.forEach((item) => {
    totalMinutes += parseDurationInMinutes(item?.duration);
  });

  const watchHours = Math.floor(totalMinutes / 60);
  const watchMins = totalMinutes % 60;
  const watchTimeFormatted = totalMinutes > 0 ? `${watchHours}г ${watchMins}хв` : '0г 0хв';

  const avatarLetter = (user.name || 'U').charAt(0).toUpperCase();

  const handleCreateListSubmit = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    onCreateList({
      title: newListTitle.trim(),
      description: newListDesc.trim()
    });
    setNewListTitle('');
    setNewListDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans animate-fadeIn">
      
      {/* ПАНЕЛЬ ПРОФІЛЮ ТА СТАТИСТИКИ */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-md border border-light-border dark:border-dark-border p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-dark-accent text-slate-950 font-heading font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm select-none">
            {avatarLetter}
          </div>

          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-wide text-light-textPrimary dark:text-dark-textPrimary">
              {user.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-light-textSecondary dark:text-dark-textSecondary font-sans">
              <Calendar className="w-3.5 h-3.5" />
              <span>У Plota з Жовтня 2026</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px bg-light-border dark:bg-dark-border self-stretch my-1" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 items-center text-center">
          <div className="space-y-0.5">
            <span className="block font-heading font-bold text-lg sm:text-xl text-dark-accent leading-none">
              {watchTimeFormatted}
            </span>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
              ГОДИН ПЕРЕГЛЯДУ
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="block font-heading font-bold text-lg sm:text-xl text-dark-accent leading-none">
              {userReviews.length}
            </span>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
              РЕЦЕНЗІЙ
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="block font-heading font-bold text-lg sm:text-xl text-dark-accent leading-none">
              {watchlistMedia.length}
            </span>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
              У ЗБЕРЕЖЕНИХ
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="block font-heading font-bold text-lg sm:text-xl text-dark-accent leading-none">
              {favoriteMedia.length}
            </span>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-light-textSecondary dark:text-dark-textSecondary">
              В УЛЮБЛЕНИХ
            </span>
          </div>
        </div>

      </div>

      {/* Експорт / Імпорт JSON */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-light-surface dark:bg-dark-surface p-3.5 rounded-md border border-light-border dark:border-dark-border">
        <span className="text-xs font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary">
          Управління даними акаунта (JSON):
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportUserData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded-xs bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:border-dark-accent transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-dark-accent" />
            <span>Експортувати JSON</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded-xs bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:border-dark-accent transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-dark-accent" />
            <span>Імпортувати JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportUserData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex items-center gap-2 border-b border-light-border dark:border-dark-border pb-2 text-xs font-sans font-bold uppercase tracking-wider overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xs transition-colors cursor-pointer shrink-0 ${
            activeTab === 'favorites'
              ? 'bg-dark-accent text-slate-950 font-bold'
              : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Улюблені ({favoriteMedia.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xs transition-colors cursor-pointer shrink-0 ${
            activeTab === 'watchlist'
              ? 'bg-dark-accent text-slate-950 font-bold'
              : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>У збережених ({watchlistMedia.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xs transition-colors cursor-pointer shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-dark-accent text-slate-950 font-bold'
              : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Мої рецензії ({userReviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lists')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xs transition-colors cursor-pointer shrink-0 ${
            activeTab === 'lists'
              ? 'bg-dark-accent text-slate-950 font-bold'
              : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Персональні добірки ({customLists.length})</span>
        </button>
      </div>

      {/* Вкладка Улюблені */}
      {activeTab === 'favorites' && (
        favoriteMedia.length === 0 ? (
          <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary italic py-8 text-center">
            У вас поки немає доданих улюблених фільмів.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoriteMedia.map((media) => (
              <MediaCard key={media.id} media={media} onClick={() => onSelectMedia(media)} />
            ))}
          </div>
        )
      )}

      {/* Вкладка Збережені */}
      {activeTab === 'watchlist' && (
        watchlistMedia.length === 0 ? (
          <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary italic py-8 text-center">
            Ваш список "У збережених" поки порожній.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchlistMedia.map((media) => (
              <MediaCard key={media.id} media={media} onClick={() => onSelectMedia(media)} />
            ))}
          </div>
        )
      )}

      {/* Вкладка Рецензії із кнопкою "Показати ще" */}
      {activeTab === 'reviews' && (
        userReviews.length === 0 ? (
          <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary italic py-8 text-center">
            Ви ще не залишили жодного відгуку.
          </p>
        ) : (
          <div className="space-y-3">
            {userReviews.slice(0, visibleReviewsCount).map((review) => {
              const movieInCatalog = allMedia.find((m) => String(m.id) === String(review.mediaId));
              const movieTitle = review.mediaTitle || movieInCatalog?.title || `Фільм #${review.mediaId}`;
              const moviePoster = review.mediaPoster || movieInCatalog?.poster;

              const targetMedia = movieInCatalog || {
                id: review.mediaId,
                title: movieTitle,
                poster: moviePoster
              };

              return (
                <div
                  key={review.id}
                  className="bg-light-surface dark:bg-dark-surface p-4 rounded-md border border-light-border dark:border-dark-border shadow-xs flex flex-col sm:flex-row gap-4 justify-between"
                >
                  <div className="flex gap-3">
                    {moviePoster ? (
                      <img
                        src={moviePoster}
                        alt={movieTitle}
                        className="w-12 h-16 object-cover rounded-xs cursor-pointer hover:opacity-80 shrink-0"
                        onClick={() => onSelectMedia(targetMedia)}
                      />
                    ) : (
                      <div 
                        className="w-12 h-16 bg-stone-800 rounded-xs flex items-center justify-center text-stone-500 shrink-0 cursor-pointer"
                        onClick={() => onSelectMedia(targetMedia)}
                      >
                        <Film className="w-5 h-5" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className="text-sm font-heading font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary cursor-pointer hover:text-dark-accent transition-colors"
                          onClick={() => onSelectMedia(targetMedia)}
                        >
                          {movieTitle}
                        </h3>

                        {review.isRewatch && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-dark-accent/10 border border-dark-accent/30 text-dark-accent text-[10px] font-sans font-bold uppercase">
                            <RotateCw className="w-2.5 h-2.5" /> Rewatch
                          </span>
                        )}

                        <span className="text-[10px] font-sans text-light-textSecondary dark:text-dark-textSecondary">
                          • {review.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-dark-accent">
                        <Star className="w-3.5 h-3.5 fill-dark-accent" />
                        <span>{review.rating}/10</span>
                      </div>

                      <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed pt-1">
                        {review.text}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-start">
                    <button
                      type="button"
                      onClick={() => onDeleteReviewGlobal(review.id)}
                      className="p-1.5 text-light-textSecondary dark:text-dark-textSecondary hover:text-red-500 transition-colors cursor-pointer"
                      title="Видалити відгук"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Кнопка "Показати ще" у профілі */}
            {userReviews.length > visibleReviewsCount && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setVisibleReviewsCount((prev) => prev + 10)}
                  className="px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-xs border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-textPrimary dark:text-dark-textPrimary hover:border-dark-accent transition-colors cursor-pointer"
                >
                  Показати ще ({userReviews.length - visibleReviewsCount})
                </button>
              </div>
            )}
          </div>
        )
      )}

      {/* Вкладка Персональні добірки */}
      {activeTab === 'lists' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-light-textSecondary dark:text-dark-textSecondary">
              Ваші тематичні листи та колекції:
            </span>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold uppercase bg-dark-accent text-slate-950 rounded-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Створити список</span>
            </button>
          </div>

          {customLists.length === 0 ? (
            <div className="text-center py-10 bg-light-surface dark:bg-dark-surface rounded-md border border-light-border dark:border-dark-border space-y-2">
              <p className="text-xs font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
                Немає персональних списків
              </p>
              <p className="text-[11px] text-light-textSecondary dark:text-dark-textSecondary">
                Натисніть кнопку вище, щоб створити добірку (наприклад: "Топ 5 нуару").
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customLists.map((list) => (
                <div
                  key={list.id}
                  className="bg-light-surface dark:bg-dark-surface p-4 rounded-md border border-light-border dark:border-dark-border shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-light-border dark:border-dark-border pb-2">
                    <div>
                      <h3 className="text-sm font-heading font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
                        {list.title} <span className="text-dark-accent text-xs">({list.items?.length || 0})</span>
                      </h3>
                      {list.description && (
                        <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-sans mt-0.5">
                          {list.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteList(list.id)}
                      className="p-1 text-light-textSecondary dark:text-dark-textSecondary hover:text-red-500 transition-colors cursor-pointer"
                      title="Видалити список"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {list.items?.length === 0 ? (
                    <p className="text-[11px] text-light-textSecondary dark:text-dark-textSecondary italic py-2">
                      У цьому списку поки немає фільмів. Додавайте їх зі сторінки будь-якого фільму!
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {list.items.map((item) => (
                        <div key={item.id} className="relative group">
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-full aspect-[2/3] object-cover rounded-xs border border-light-border dark:border-dark-border cursor-pointer hover:opacity-80"
                            onClick={() => onSelectMedia(item)}
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveFromList(list.id, item.id)}
                            className="absolute top-1 right-1 p-1 bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all cursor-pointer"
                            title="Прибрати зі списку"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Модальне вікно створення списку */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border pb-2">
              <h3 className="text-sm font-heading font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
                Створити новий список
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-light-textSecondary dark:text-dark-textSecondary hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateListSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary block mb-1">
                  Назва списку *
                </label>
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="наприклад: Топ атмосферного нуару"
                  className="w-full p-2 text-xs font-sans bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xs text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-dark-accent"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary block mb-1">
                  Опис (необов'язково)
                </label>
                <textarea
                  rows={2}
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="Короткий опис добірки..."
                  className="w-full p-2 text-xs font-sans bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xs text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:border-dark-accent resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs font-sans font-bold uppercase text-light-textSecondary dark:text-dark-textSecondary hover:underline"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  disabled={!newListTitle.trim()}
                  className="px-4 py-1.5 text-xs font-sans font-bold uppercase bg-dark-accent text-slate-950 rounded-xs hover:opacity-90 disabled:opacity-50"
                >
                  Створити
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};