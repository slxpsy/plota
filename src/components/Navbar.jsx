import React from 'react';
import { Search, Film, User, LogOut, Dice5, Popcorn } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const WitchHatIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 20h20" />
    <path d="M5 20l5-16 4 5 1-2 4 13" />
    <path d="M6.5 15.5h11" />
  </svg>
);

export const Navbar = ({ 
  currentView, 
  setCurrentView, 
  searchQuery, 
  setSearchQuery, 
  user, 
  onLogout,
  onOpenRoulette,
  isPopcornEnabled,
  onTogglePopcorn
}) => {
  return (
    <header className="w-full bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border transition-colors duration-200 relative z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* Логотип */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="relative flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="relative w-7 h-7 rounded-xs bg-dark-accent text-slate-950 font-bold flex items-center justify-center">
            <WitchHatIcon className="absolute -top-2 -left-1.5 w-4 h-4 -rotate-12 text-light-textPrimary dark:text-dark-textPrimary transition-transform group-hover:rotate-0 duration-200" />
            <Film className="w-4 h-4" />
          </div>
          
          <span className="font-heading font-bold text-lg uppercase tracking-widest text-light-textPrimary dark:text-dark-textPrimary">
            Plota<span className="text-dark-accent">.</span>
          </span>
        </div>

        {/* Навігація */}
        <nav className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'bg-dark-accent text-slate-950 border-transparent font-bold'
                : 'border-transparent text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
            }`}
          >
            Головна
          </button>

          <button
            onClick={() => setCurrentView('catalog')}
            className={`px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${
              currentView === 'catalog'
                ? 'bg-dark-accent text-slate-950 border-transparent font-bold'
                : 'border-transparent text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
            }`}
          >
            Каталог
          </button>
        </nav>

        {/* Пошук */}
        <div className="relative flex-1 max-w-xs hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-light-textSecondary dark:text-dark-textSecondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'catalog') setCurrentView('catalog');
            }}
            placeholder="Шукати фільм у Plota..."
            className="w-full pl-8 pr-3 py-1 text-xs font-sans rounded-xs
                       bg-light-bg dark:bg-dark-bg
                       border border-light-border dark:border-dark-border
                       text-light-textPrimary dark:text-dark-textPrimary placeholder-light-textSecondary dark:placeholder-dark-textSecondary
                       focus:outline-none focus:border-dark-accent transition-colors duration-150"
          />
        </div>

        {/* Права панель функцій */}
        <div className="flex items-center gap-2">
          
          {/* Кнопка Movie Hunter */}
          <button
            onClick={onOpenRoulette}
            title="Movie Hunter"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded-xs border border-dark-accent/40 bg-dark-accent/10 text-dark-accent hover:bg-dark-accent hover:text-slate-950 transition-all cursor-pointer"
          >
            <Dice5 className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">Movie Hunter</span>
          </button>

          {/* Авторизація / Профіль */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-bold uppercase tracking-wider rounded-xs border transition-colors cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-dark-accent text-slate-950 border-transparent'
                    : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textPrimary dark:text-dark-textPrimary hover:border-dark-accent'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{user.name}</span>
              </button>

              <button
                onClick={onLogout}
                title="Вийти"
                className="p-1.5 text-light-textSecondary dark:text-dark-textSecondary hover:text-red-500 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded-xs bg-dark-accent text-slate-950 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Увійти</span>
            </button>
          )}

          {/* Кнопка перемикання зерен попкорну */}
          <button
            onClick={onTogglePopcorn}
            title={isPopcornEnabled ? "Вимкнути попкорн" : "Увімкнути попкорн"}
            className={`p-1.5 rounded-xs border transition-all cursor-pointer ${
              isPopcornEnabled
                ? 'bg-dark-accent/10 border-dark-accent/40 text-dark-accent'
                : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary opacity-50 hover:opacity-100'
            }`}
          >
            <Popcorn className="w-3.5 h-3.5" />
          </button>

          {/* Перемикач теми */}
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
};