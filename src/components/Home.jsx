import React from 'react';
import { PosterCarousel } from './PosterCarousel';
import { MediaCard } from './MediaCard';
import { VibeCheck } from './VibeCheck';
import { ArrowRight } from 'lucide-react';

export const Home = ({
  onGoToCatalog,
  trendingMedia,
  onSelectMedia,
  watchlist = [],
  onToggleWatchlist,
}) => {
  return (
    <div className="w-full font-sans">
      <PosterCarousel
        allMedia={trendingMedia}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
        onSelectMedia={onSelectMedia}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-8 space-y-6">
        <VibeCheck allMedia={trendingMedia} onSelectMedia={onSelectMedia} />

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary">
                Популярне в каталозі
              </h2>
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-0.5">
                Стрічки з найвищими оцінками глядачів
              </p>
            </div>

            <button
              type="button"
              onClick={onGoToCatalog}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline cursor-pointer"
            >
              <span>Увесь каталог ({trendingMedia.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingMedia.slice(0, 12).map((item) => (
              <MediaCard key={item.id} media={item} onClick={onSelectMedia} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};