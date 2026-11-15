import React from 'react';
import { Star, Clock, Film } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SkeletonCard = () => (
  <div className="relative rounded-md bg-light-surface dark:bg-dark-surface animate-pulse p-2.5 border border-light-border dark:border-dark-border">
    <div className="w-full aspect-[2/3] rounded-sm bg-light-border dark:bg-dark-border" />
    <div className="mt-2.5 h-4 bg-light-border dark:bg-dark-border rounded-sm w-3/4" />
    <div className="mt-1.5 h-3 bg-light-border dark:bg-dark-border rounded-sm w-1/2" />
  </div>
);

export const MediaCard = ({ media, onClick }) => {
  const { movieTitle } = useLanguage();
  const title = movieTitle(media);
  if (!media) return null;

  return (
    /* 
      Батьківський контейнер тепер отримує `hover:z-20 relative`, 
      що змушує активну картку бути "поверх" усіх сусідів.
    */
    <div 
      className="relative group cursor-pointer font-sans select-none hover:z-20 transition-[z-index] duration-150" 
      onClick={() => onClick(media)}
    >
      
      {/* 
        ЗАДНІЙ ЖОВТИЙ ШАР:
        Ми суттєво зменшили виліт (з 2.5 до 1) та нахил (з rotate-3 до rotate-1.5),
        щоб він залишався акуратним і не зачіпав сусідні картки в сітці.
      */}
      <div 
        className="absolute inset-0 rounded-md bg-dark-accent/90 opacity-0 scale-95 
                   group-hover:opacity-100 group-hover:scale-100 
                   group-hover:translate-x-1 group-hover:translate-y-1 group-hover:rotate-[1.5deg] 
                   transition-all duration-200 ease-out z-0 pointer-events-none shadow-md shadow-dark-accent/10" 
      />

      {/* 
        ПЕРЕДНЯ ОСНОВНА КАРТКА:
        Також зменшено компенсуючий зсув вліво-вгору до -0.5 (-2px), 
        що зберігає чудовий 3D-ефект, але не ламає пропорції та відстані.
      */}
      <article
        className="relative z-10 rounded-md p-2.5
                   bg-light-surface dark:bg-dark-surface
                   border border-light-border dark:border-dark-border
                   group-hover:border-dark-accent
                   group-hover:-translate-x-0.5 group-hover:-translate-y-0.5
                   transition-all duration-200 ease-out
                   flex flex-col justify-between shadow-xs"
      >
        <div className="relative w-full aspect-[2/3] rounded-sm overflow-hidden bg-stone-900">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-stone-800 to-stone-950 p-3 text-center text-stone-300" aria-hidden="true">
            <Film className="h-7 w-7 text-dark-accent/80" />
            <span className="font-heading text-sm font-bold line-clamp-3">{title}</span>
          </div>
          <img
            src={media.poster}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300"
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
          
          {/* Рейтинг */}
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-sm bg-black/80 text-dark-imdb text-[11px] font-sans font-bold flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-dark-imdb text-dark-imdb" />
            <span>{media.rating}</span>
          </div>
        </div>

        <div className="mt-2.5 px-0.5">
          <h3 className="font-heading font-bold uppercase tracking-wide text-light-textPrimary dark:text-dark-textPrimary text-sm line-clamp-1 group-hover:text-dark-accent transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-1 text-xs text-light-textSecondary dark:text-dark-textSecondary font-sans font-medium">
            <span>{media.year}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {media.duration}
            </span>
          </div>
        </div>
      </article>

    </div>
  );
};
