import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Переключити тему"
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-bold uppercase tracking-wider
                 bg-light-surface dark:bg-dark-surface
                 border border-light-border dark:border-dark-border
                 text-stone-900 dark:text-stone-100
                 hover:border-light-accent1 dark:hover:border-dark-accent2 rounded-xs"
    >
      {isDark ? (
        <>
          <Moon className="w-3.5 h-3.5 text-dark-accent2" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Light</span>
        </>
      )}
    </button>
  );
};