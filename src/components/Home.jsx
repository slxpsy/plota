import React from 'react';
import { PosterCarousel } from './PosterCarousel';
import { MediaCard } from './MediaCard';
import { VibeCheck } from './VibeCheck';
import { ArrowRight } from 'lucide-react';

export const Home = ({ onGoToCatalog, trendingMedia, onSelectMedia }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 font-sans">
      
      {/* Карусель */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-light-textSecondary dark:text-dark-textSecondary">
            Вибір тижня
          </h2>
        </div>
        <PosterCarousel />
      </section>

      {/* Нова секція Vibecheck */}
      <VibeCheck allMedia={trendingMedia} onSelectMedia={onSelectMedia} />

      {/* Популярні фільми */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border pb-2">
          <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-light-textPrimary dark:text-dark-textPrimary">
            Популярні фільми
          </h2>
          <button
            onClick={onGoToCatalog}
            className="text-xs font-sans font-semibold text-dark-accent hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Усі {trendingMedia.length} фільмів</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {trendingMedia.slice(0, 12).map((item) => (
            <MediaCard key={item.id} media={item} onClick={onSelectMedia} />
          ))}
        </div>
      </section>

    </div>
  );
};