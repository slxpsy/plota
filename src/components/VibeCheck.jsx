import React, { useState } from 'react';
import { 
  CloudRain, 
  Hourglass, 
  BrainCircuit, 
  Ghost, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Coffee, 
  Users, 
  Headphones, 
  Eye, 
  Film,
  X 
} from 'lucide-react';
import { MediaCard } from './MediaCard';

// Розширений список вайбчеків та тропів
const VIBECHECK_TAGS = [
  {
    id: 'rainy-lofi',
    label: 'Rainy Night / Lo-Fi',
    icon: CloudRain,
    color: 'hover:border-blue-500/80 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    matchKeyword: 'дощ'
  },
  {
    id: 'morally-grey',
    label: 'Morally Grey Lead',
    icon: Ghost,
    color: 'hover:border-purple-500/80 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400',
    matchKeyword: 'нуар'
  },
  {
    id: 'slow-burn',
    label: 'Slow Burn',
    icon: Hourglass,
    color: 'hover:border-amber-500/80 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    matchKeyword: 'драма'
  },
  {
    id: 'mind-games',
    label: 'Mind Games & Duels',
    icon: BrainCircuit,
    color: 'hover:border-rose-500/80 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400',
    matchKeyword: 'психологічний'
  },
  {
    id: 'dark-academia',
    label: 'Dark Academia',
    icon: BookOpen,
    color: 'hover:border-emerald-500/80 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    matchKeyword: 'історичний'
  },
  {
    id: 'plot-twist',
    label: 'Mindfuck / Plot Twist',
    icon: Zap,
    color: 'hover:border-yellow-500/80 hover:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    matchKeyword: 'трилер'
  },
  {
    id: 'cozy-nostalgia',
    label: 'Cozy & Nostalgic',
    icon: Coffee,
    color: 'hover:border-orange-500/80 hover:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    matchKeyword: 'меланхолія'
  },
  {
    id: 'found-family',
    label: 'Found Family',
    icon: Users,
    color: 'hover:border-teal-500/80 hover:bg-teal-500/10 text-teal-600 dark:text-teal-400',
    matchKeyword: 'пригоди'
  },
  {
    id: 'coming-of-age',
    label: 'Indie / Coming-of-Age',
    icon: Headphones,
    color: 'hover:border-pink-500/80 hover:bg-pink-500/10 text-pink-600 dark:text-pink-400',
    matchKeyword: 'мелодрама'
  },
  {
    id: 'unreliable-narrator',
    label: 'Unreliable Narrator',
    icon: Eye,
    color: 'hover:border-indigo-500/80 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    matchKeyword: 'детектив'
  },
  {
    id: 'synthwave-retro',
    label: 'Neon / 80s Retro',
    icon: Film,
    color: 'hover:border-fuchsia-500/80 hover:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
    matchKeyword: 'неоновий'
  }
];

export const VibeCheck = ({ allMedia = [], onSelectMedia }) => {
  const [selectedTag, setSelectedTag] = useState(null);

  // Пошук фільмів за ключовим словом
  const filteredMedia = selectedTag
    ? allMedia.filter((item) => {
        const kw = selectedTag.matchKeyword.toLowerCase();
        const inMood = item.mood && item.mood.toLowerCase().includes(kw);
        const inGenres = item.genres && item.genres.some((g) => g.toLowerCase().includes(kw));
        const inSynopsis = item.synopsis && item.synopsis.toLowerCase().includes(kw);
        return inMood || inGenres || inSynopsis;
      })
    : [];

  return (
    <section className="bg-light-surface dark:bg-dark-surface p-4 sm:p-5 rounded-md border border-light-border dark:border-dark-border space-y-4 shadow-xs">
      
      {/* Заголовок Vibecheck */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-dark-accent" />
          <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-light-textPrimary dark:text-dark-textPrimary">
            Vibecheck <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-sans font-normal border-l border-light-border dark:border-dark-border pl-2 ml-1">фільтри під настрій</span>
          </h2>
        </div>

        {selectedTag && (
          <button
            onClick={() => setSelectedTag(null)}
            className="flex items-center gap-1 text-[11px] font-sans font-semibold text-light-textSecondary dark:text-dark-textSecondary hover:text-red-500 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Скинути Vibecheck</span>
          </button>
        )}
      </div>

      {/* Розширений масив чипсів/тегів */}
      <div className="flex flex-wrap gap-2">
        {VIBECHECK_TAGS.map((tag) => {
          const Icon = tag.icon;
          const isSelected = selectedTag?.id === tag.id;

          return (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(isSelected ? null : tag)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs border text-xs font-sans font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-dark-accent text-slate-950 border-transparent font-bold shadow-xs'
                  : `bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border ${tag.color}`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tag.label}</span>
            </button>
          );
        })}
      </div>

      {/* Результат Vibecheck */}
      {selectedTag && (
        <div className="pt-3 border-t border-light-border dark:border-dark-border space-y-3">
          <div className="flex items-center justify-between text-xs font-sans text-light-textSecondary dark:text-dark-textSecondary">
            <span>
              Результати Vibecheck для <strong className="text-dark-accent">{selectedTag.label}</strong>:
            </span>
            <span>Знайдено: {filteredMedia.length}</span>
          </div>

          {filteredMedia.length === 0 ? (
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary italic py-2">
              Під цей Vibecheck поки немає відповідних фільмів у каталозі.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredMedia.map((media) => (
                <MediaCard key={media.id} media={media} onClick={onSelectMedia} />
              ))}
            </div>
          )}
        </div>
      )}

    </section>
  );
};