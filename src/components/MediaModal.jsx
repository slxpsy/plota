import React from 'react';
import { X, Star, Clock } from 'lucide-react';

export const MediaModal = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      <div className="relative w-full max-w-xl rounded-xs overflow-hidden bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-stone-900 dark:text-stone-100 z-10 p-6 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-xs bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <img src={media.poster} alt={media.title} className="w-24 aspect-[2/3] object-cover rounded-xs border border-light-border dark:border-dark-border" />
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold uppercase bg-light-accent1 dark:bg-dark-accent1 text-white">
              {media.mood}
            </span>
            <h2 className="text-xl font-bold uppercase tracking-wide mt-1">{media.title}</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
              <span>{media.year}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {media.duration}</span>
              <span>•</span>
              <span className="text-amber-500 font-bold flex items-center gap-0.5"><Star className="w-3 h-3 fill-current" /> {media.rating}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">{media.synopsis}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-light-border dark:border-dark-border flex flex-wrap gap-1.5">
          {media.genres.map((genre) => (
            <span key={genre} className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-stone-600 dark:text-stone-300">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};