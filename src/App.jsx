import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { MediaCard, SkeletonCard } from './components/MediaCard';
import { MediaDetailPage } from './components/MediaDetailPage';
import { AuthPage } from './components/AuthPage';
import { ProfilePage } from './components/ProfilePage';
import { PopcornEasterEgg } from './components/PopcornEasterEgg';
import { CustomSelect } from './components/CustomSelect';
import { RandomMovieModal } from './components/RandomMovieModal';
import { useMediaCatalog } from './hooks/useMediaCatalog';
import { SlidersHorizontal, AlertCircle, RotateCcw } from 'lucide-react';

export function CatalogContent() {
  const [currentView, setCurrentView] = useState('home');
  const [previousView, setPreviousView] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);

  // Стан анімації попкорну
  const [isPopcornEnabled, setIsPopcornEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('plota_popcorn');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleTogglePopcorn = () => {
    setIsPopcornEnabled((prev) => {
      const updated = !prev;
      try {
        localStorage.setItem('plota_popcorn', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');

  // Завантаження акаунта
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('plota_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const userIdKey = user ? (user.id || user.email || user.name) : 'guest';

  // Персональні списки під конкретного користувача
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [customLists, setCustomLists] = useState([]);

  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(`plota_favorites_${userIdKey}`);
      const savedWatch = localStorage.getItem(`plota_watchlist_${userIdKey}`);
      const savedLists = localStorage.getItem(`plota_custom_lists_${userIdKey}`);

      setFavorites(savedFavs ? JSON.parse(savedFavs) : []);
      setWatchlist(savedWatch ? JSON.parse(savedWatch) : []);
      setCustomLists(savedLists ? JSON.parse(savedLists) : []);
    } catch (e) {
      console.error(e);
      setFavorites([]);
      setWatchlist([]);
      setCustomLists([]);
    }
  }, [userIdKey]);

  // Глобальні рецензії
  const [allGlobalReviews, setAllGlobalReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('plota_global_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('plota_global_reviews', JSON.stringify(allGlobalReviews));
    } catch (e) {
      console.error(e);
    }
  }, [allGlobalReviews]);

  const { data, loading, error } = useMediaCatalog({
    searchQuery,
    selectedGenre,
    selectedYear,
    minRating,
    sortBy,
  });

  const isFiltered =
    selectedGenre !== 'All' ||
    selectedYear !== 'All' ||
    minRating > 0 ||
    sortBy !== 'default' ||
    searchQuery !== '';

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSelectedYear('All');
    setMinRating(0);
    setSortBy('default');
    setSearchQuery('');
  };

  const handleOpenDetail = (media, fromView) => {
    setSelectedMedia(media);
    setPreviousView(fromView || currentView);
    setCurrentView('detail');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('plota_user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
    setCurrentView('profile');
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    setWatchlist([]);
    setCustomLists([]);
    try {
      localStorage.removeItem('plota_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentView('home');
  };

  const toggleFavorite = (media) => {
    const exists = favorites.some((f) => String(f.id) === String(media.id));
    const updated = exists
      ? favorites.filter((f) => String(f.id) !== String(media.id))
      : [...favorites, media];
    setFavorites(updated);
    try {
      localStorage.setItem(`plota_favorites_${userIdKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWatchlist = (media) => {
    const exists = watchlist.some((w) => String(w.id) === String(media.id));
    const updated = exists
      ? watchlist.filter((w) => String(w.id) !== String(media.id))
      : [...watchlist, media];
    setWatchlist(updated);
    try {
      localStorage.setItem(`plota_watchlist_${userIdKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Методи для персональних списків
  const handleCreateList = ({ title, description }) => {
    const newList = {
      id: 'list-' + Date.now(),
      title,
      description,
      items: []
    };
    const updated = [newList, ...customLists];
    setCustomLists(updated);
    try {
      localStorage.setItem(`plota_custom_lists_${userIdKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteList = (listId) => {
    const updated = customLists.filter((l) => String(l.id) !== String(listId));
    setCustomLists(updated);
    try {
      localStorage.setItem(`plota_custom_lists_${userIdKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleMediaInList = (listId, media) => {
    const updated = customLists.map((list) => {
      if (String(list.id) === String(listId)) {
        const exists = list.items?.some((i) => String(i.id) === String(media.id));
        const newItems = exists
          ? list.items.filter((i) => String(i.id) !== String(media.id))
          : [...(list.items || []), media];
        return { ...list, items: newItems };
      }
      return list;
    });
    setCustomLists(updated);
    try {
      localStorage.setItem(`plota_custom_lists_${userIdKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFromList = (listId, mediaId) => {
    const updated = customLists.map((list) => {
      if (String(list.id) === String(listId)) {
        return {
          ...list,
          items: list.items.filter((i) => String(i.id) !== String(mediaId))
        };
      }
      return list;
    });
    setCustomLists(updated);
    try {
      localStorage.setItem(`plota_custom_lists_${userIdKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Експорт та імпорт даних JSON
  const handleExportUserData = () => {
    const dataToExport = {
      user,
      favorites,
      watchlist,
      customLists,
      userReviews,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plota_data_${user?.username || 'user'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportUserData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (parsed.favorites && Array.isArray(parsed.favorites)) {
          setFavorites(parsed.favorites);
          localStorage.setItem(`plota_favorites_${userIdKey}`, JSON.stringify(parsed.favorites));
        }
        if (parsed.watchlist && Array.isArray(parsed.watchlist)) {
          setWatchlist(parsed.watchlist);
          localStorage.setItem(`plota_watchlist_${userIdKey}`, JSON.stringify(parsed.watchlist));
        }
        if (parsed.customLists && Array.isArray(parsed.customLists)) {
          setCustomLists(parsed.customLists);
          localStorage.setItem(`plota_custom_lists_${userIdKey}`, JSON.stringify(parsed.customLists));
        }
        alert('Дані успішно імпортовано!');
      } catch (err) {
        alert('Помилка читання файлу JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleAddReviewGlobal = (newReview) => {
    setAllGlobalReviews((prev) => [newReview, ...prev]);
  };

  const handleDeleteReviewGlobal = (reviewId) => {
    setAllGlobalReviews((prev) => prev.filter((r) => String(r.id) !== String(reviewId)));
  };

  const userReviews = user
    ? allGlobalReviews.filter(
        (r) =>
          (user.id && String(r.userId) === String(user.id)) ||
          (user.name && r.author === user.name)
      )
    : [];

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-textPrimary dark:text-dark-textPrimary font-sans relative overflow-x-hidden">
      
      {/* Попкорн */}
      {isPopcornEnabled && <PopcornEasterEgg />}

      {/* Navbar */}
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onLogout={handleLogout}
        onOpenRoulette={() => setIsRouletteOpen(true)}
        isPopcornEnabled={isPopcornEnabled}
        onTogglePopcorn={handleTogglePopcorn}
      />

      <main className="w-full relative z-10">
        {currentView === 'home' && (
          <Home 
            onGoToCatalog={() => setCurrentView('catalog')}
            trendingMedia={data}
            onSelectMedia={(item) => handleOpenDetail(item, 'home')}
          />
        )}

        {currentView === 'catalog' && (
          <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
            
            <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-md border border-light-border dark:border-dark-border space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-light-border dark:border-dark-border pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-dark-accent" />
                  <h1 className="text-base font-heading font-bold uppercase tracking-wider">
                    Каталог та фільтри
                  </h1>
                  <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-sans">
                    (Знайдено: <strong className="text-dark-accent font-bold">{data.length}</strong>)
                  </span>
                </div>

                {isFiltered && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-semibold text-red-500 hover:bg-red-500/10 border border-red-500/30 rounded-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Скинути все</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <CustomSelect
                  label="Жанр"
                  value={selectedGenre}
                  onChange={setSelectedGenre}
                  options={[
                    { label: 'Усі жанри', value: 'All' },
                    { label: 'Фантастика', value: 'Фантастика' },
                    { label: 'Драма', value: 'Драма' },
                    { label: 'Трилер', value: 'Трилер' },
                    { label: 'Кримінал', value: 'Кримінал' },
                    { label: 'Екшн', value: 'Екшн' },
                    { label: 'Біографія', value: 'Біографія' },
                    { label: 'Мелодрама', value: 'Мелодрама' },
                    { label: 'Музика', value: 'Музика' },
                  ]}
                />

                <CustomSelect
                  label="Рік випуску"
                  value={selectedYear}
                  onChange={setSelectedYear}
                  options={[
                    { label: 'Усі роки', value: 'All' },
                    { label: '2020-ті (2020+)', value: '2020s' },
                    { label: '2010-ті (2010–2019)', value: '2010s' },
                    { label: '2000-ні (2000–2009)', value: '2000s' },
                    { label: 'Класика (до 2000)', value: 'older' },
                  ]}
                />

                <CustomSelect
                  label="Мін. Рейтинг IMDb"
                  value={minRating}
                  onChange={(val) => setMinRating(Number(val))}
                  options={[
                    { label: 'Будь-який', value: 0 },
                    { label: '8.0+', value: 8.0 },
                    { label: '8.5+', value: 8.5 },
                  ]}
                />

                <CustomSelect
                  label="Сортувати за"
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { label: 'За замовчуванням', value: 'default' },
                    { label: 'Рейтингом (спочатку вищий)', value: 'rating_desc' },
                    { label: 'Роком (спочатку новіші)', value: 'year_desc' },
                    { label: 'Роком (спочатку старіші)', value: 'year_asc' },
                    { label: 'Назвою (А-Я)', value: 'title_asc' },
                  ]}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800 text-red-400 text-xs font-sans flex items-center gap-2 rounded-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-12 bg-light-surface dark:bg-dark-surface rounded-md border border-light-border dark:border-dark-border space-y-2">
                <p className="text-sm font-heading font-bold uppercase text-light-textPrimary dark:text-dark-textPrimary">
                  Нічого не знайдено
                </p>
                <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                  Спробуйте змінити або скинути вибрані фільтри.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 px-3 py-1.5 text-xs font-sans font-bold uppercase bg-dark-accent text-slate-950 rounded-xs cursor-pointer"
                >
                  Скинути фільтри
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.map((item) => (
                  <MediaCard key={item.id} media={item} onClick={(m) => handleOpenDetail(m, 'catalog')} />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Сторінка фільму */}
        {currentView === 'detail' && selectedMedia && (
          <MediaDetailPage 
            media={selectedMedia} 
            onBack={() => setCurrentView(previousView || 'catalog')}
            backLabel={
              previousView === 'profile'
                ? 'Назад до профілю'
                : previousView === 'home'
                ? 'Назад на головну'
                : 'Назад до каталогу'
            }
            isFavorite={favorites.some((f) => String(f.id) === String(selectedMedia.id))}
            isWatchlist={watchlist.some((w) => String(w.id) === String(selectedMedia.id))}
            onToggleFavorite={toggleFavorite}
            onToggleWatchlist={toggleWatchlist}
            currentUser={user}
            onAddReviewGlobal={handleAddReviewGlobal}
            onDeleteReviewGlobal={handleDeleteReviewGlobal}
            allGlobalReviews={allGlobalReviews}
            customLists={customLists}
            onToggleMediaInList={handleToggleMediaInList}
          />
        )}

        {currentView === 'login' && (
          <AuthPage 
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {/* Профіль */}
        {currentView === 'profile' && user && (
          <ProfilePage 
            user={user}
            favoriteMedia={favorites}
            watchlistMedia={watchlist}
            userReviews={userReviews}
            onSelectMedia={(item) => handleOpenDetail(item, 'profile')}
            onDeleteReviewGlobal={handleDeleteReviewGlobal}
            allMedia={data}
            customLists={customLists}
            onCreateList={handleCreateList}
            onDeleteList={handleDeleteList}
            onRemoveFromList={handleRemoveFromList}
            onExportUserData={handleExportUserData}
            onImportUserData={handleImportUserData}
          />
        )}
      </main>

      <RandomMovieModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        mediaList={data}
        onSelectMedia={(m) => handleOpenDetail(m, currentView)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CatalogContent />
    </ThemeProvider>
  );
}