import React from 'react';
import { Search, User, LogOut, Dice5 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '../context/LanguageContext';

const PlotaLogo = () => (
  <span className="inline-flex items-center font-black text-2xl tracking-tight text-light-textPrimary dark:text-dark-textPrimary select-none">
    <span>PL</span>
    <svg
      viewBox="0 0 28 28"
      className="w-[22px] h-[22px] mx-[1px] text-yellow-500 dark:text-yellow-400 transition-transform duration-500 group-hover:rotate-90"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="11.5" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="14" cy="14" r="3" fill="currentColor" />
      <circle cx="14" cy="7.2" r="1.6" fill="currentColor" />
      <circle cx="14" cy="20.8" r="1.6" fill="currentColor" />
      <circle cx="7.2" cy="14" r="1.6" fill="currentColor" />
      <circle cx="20.8" cy="14" r="1.6" fill="currentColor" />
    </svg>
    <span>TA</span>
  </span>
);

export const Navbar = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  user,
  onLogout,
  onOpenRoulette,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <header className="sticky top-0 w-full bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-light-border dark:border-dark-border transition-colors duration-200 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="flex items-center cursor-pointer group focus:outline-none"
        >
          <PlotaLogo />
        </button>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className={`relative py-1 transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'text-light-textPrimary dark:text-dark-textPrimary font-semibold'
                : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
            }`}
          >
            {t('Головна')}
            {currentView === 'home' && (
              <span className="absolute inset-x-0 -bottom-[19px] h-[2px] bg-yellow-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('catalog')}
            className={`relative py-1 transition-colors cursor-pointer ${
              currentView === 'catalog'
                ? 'text-light-textPrimary dark:text-dark-textPrimary font-semibold'
                : 'text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
            }`}
          >
            {t('Каталог')}
            {currentView === 'catalog' && (
              <span className="absolute inset-x-0 -bottom-[19px] h-[2px] bg-yellow-400" />
            )}
          </button>
        </nav>

        <div className="relative flex-1 max-w-xs hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-light-textSecondary dark:text-dark-textSecondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'catalog') setCurrentView('catalog');
            }}
            placeholder={t('Пошук фільму...')}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md
                       bg-light-surface dark:bg-dark-surface
                       border border-light-border dark:border-dark-border
                       text-light-textPrimary dark:text-dark-textPrimary placeholder-light-textSecondary dark:placeholder-dark-textSecondary
                       focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenRoulette}
            title={t('Випадковий фільм')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md
                       border border-light-border dark:border-dark-border
                       bg-light-surface dark:bg-dark-surface
                       text-light-textPrimary dark:text-dark-textPrimary
                       hover:border-yellow-400 transition-colors cursor-pointer"
          >
            <Dice5 className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400 shrink-0" />
            <span className="hidden sm:inline">Movie Hunter</span>
          </button>

          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentView('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-yellow-400 text-zinc-950 border-yellow-400'
                    : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:border-yellow-400'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{user.name}</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                title={t('Вийти')}
                className="p-1.5 text-light-textSecondary dark:text-dark-textSecondary hover:text-red-500 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-yellow-400 text-zinc-950 hover:bg-yellow-300 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('Увійти')}</span>
            </button>
          )}

          <ThemeToggle />
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={language === 'uk' ? 'Switch language to English' : 'Змінити мову на українську'}
            title={language === 'uk' ? 'Switch language to English' : 'Змінити мову на українську'}
            className="min-w-10 px-2.5 py-1.5 text-xs font-bold rounded-md border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-textPrimary dark:text-dark-textPrimary hover:border-yellow-400 transition-colors cursor-pointer"
          >
            {language === 'uk' ? 'EN' : 'УК'}
          </button>
        </div>
      </div>
    </header>
  );
};
