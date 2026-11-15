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
import { useLanguage } from '../context/LanguageContext';

// Розширений список вайбчеків та тропів
const VIBECHECK_TAGS = [
  {
    id: 'rainy-lofi',
    label: 'Rainy Night / Lo-Fi',
    icon: CloudRain,
    matchKeyword: 'дощ'
  },
  {
    id: 'morally-grey',
    label: 'Morally Grey Lead',
    icon: Ghost,
    matchKeyword: 'нуар'
  },
  {
    id: 'slow-burn',
    label: 'Slow Burn',
    icon: Hourglass,
    matchKeyword: 'драма'
  },
  {
    id: 'mind-games',
    label: 'Mind Games & Duels',
    icon: BrainCircuit,
    matchKeyword: 'психологічний'
  },
  {
    id: 'dark-academia',
    label: 'Dark Academia',
    icon: BookOpen,
    matchKeyword: 'історичний'
  },
  {
    id: 'plot-twist',
    label: 'Mindfuck / Plot Twist',
    icon: Zap,
    matchKeyword: 'трилер'
  },
  {
    id: 'cozy-nostalgia',
    label: 'Cozy & Nostalgic',
    icon: Coffee,
    matchKeyword: 'меланхолія'
  },
  {
    id: 'found-family',
    label: 'Found Family',
    icon: Users,
    matchKeyword: 'пригоди'
  },
  {
    id: 'coming-of-age',
    label: 'Indie / Coming-of-Age',
    icon: Headphones,
    matchKeyword: 'мелодрама'
  },
  {
    id: 'unreliable-narrator',
    label: 'Unreliable Narrator',
    icon: Eye,
    matchKeyword: 'детектив'
  },
  {
    id: 'synthwave-retro',
    label: 'Neon / 80s Retro',
    icon: Film,
    matchKeyword: 'неоновий'
  }
];

export const VibeCheck = ({ allMedia = [], onSelectMedia }) => {
  const { t } = useLanguage();
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
            Vibecheck <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-sans font-normal border-l border-light-border dark:border-dark-border pl-2 ml-1">{t('фільтри під настрій')}</span>
          </h2>
        </div>

        {selectedTag && (
          <button
            onClick={() => setSelectedTag(null)}
            className="flex items-center gap-1 text-[11px] font-sans font-semibold text-light-textSecondary dark:text-dark-textSecondary hover:text-red-500 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>{t('Скинути Vibecheck')}</span>
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs border text-xs font-sans font-medium transition-colors duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-accent ${
                isSelected
                  ? 'bg-dark-accent text-slate-950 border-dark-accent font-bold shadow-xs'
                  : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-textSecondary dark:text-dark-textSecondary hover:border-dark-accent/70 hover:bg-dark-accent/5 hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-dark-accent/80'}`} />
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
              {t('Результати Vibecheck для')} <strong className="text-dark-accent">{selectedTag.label}</strong>:
            </span>
            <span>{t('Знайдено:')} {filteredMedia.length}</span>
          </div>

          {filteredMedia.length === 0 ? (
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary italic py-2">
              {t('Під цей Vibecheck поки немає відповідних фільмів у каталозі.')}
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
