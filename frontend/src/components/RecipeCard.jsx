import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RecipeCard = ({ recipe, isFavorite = false, onFavoriteToggle = null }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { id, title, category, cookingTime, difficulty, imageUrl, createdByRole } = recipe;

  const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    medium: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    hard: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
  };

  const diffKey = (difficulty || 'easy').toLowerCase();
  const diffClass = difficultyColors[diffKey] || difficultyColors.easy;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  const getImagePath = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';
    if (path.startsWith('http')) return path;
    return path; // Vite handles relative proxy URLs automatically
  };

  return (
    <div 
      onClick={() => navigate(`/recipe/${id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/50 dark:bg-slate-900"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-150 dark:bg-slate-800">
        <img 
          src={getImagePath(imageUrl)} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Overlay */}
        <div className="absolute left-3 top-3 rounded-lg bg-black/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          {category}
        </div>

        {/* AI Stamp Overlay */}
        {createdByRole === 'ADMIN' && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-amber-500/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-md">
            <Sparkles className="h-3 w-3 animate-pulse" />
            AI Chef
          </div>
        )}

        {/* Bookmark heart Button */}
        {isAuthenticated && !isAdmin && onFavoriteToggle && (
          <button
            onClick={handleFavoriteClick}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-400 shadow-md hover:text-red-500 dark:bg-slate-900/90 transition-all duration-200 active:scale-90"
            aria-label="Add to favorites"
          >
            <Heart 
              className={`h-5 w-5 transition-colors duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-450'}`} 
            />
          </button>
        )}
      </div>

      {/* Body Information */}
      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors duration-200">
          {title}
        </h3>
        
        <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            <span>{cookingTime} mins</span>
          </div>

          <span className={`rounded-md px-2 py-0.5 text-2xs uppercase tracking-wider font-bold ${diffClass}`}>
            {difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
