import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Flame, Star } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

/**
 * RecipeCard Component
 * Displays a recipe in a card format with image, title, description, and action buttons
 * 
 * Props:
 * - recipe: {id, title, description, image, cuisine, difficulty, prepTime, rating, isFavorite}
 * - isLoading: boolean - shows skeleton loader
 * - onFavoriteToggle: (recipeId) => void
 */
const RecipeCard = ({ recipe, isLoading = false, onFavoriteToggle }) => {
  const [isFavorited, setIsFavorited] = useState(recipe?.isFavorite || false);

  if (isLoading) {
    return <SkeletonLoader type="card" />;
  }

  if (!recipe) return null;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.id);
    }
  };

  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <Link to={`/recipes/${recipe.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        {/* Recipe Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={recipe.image || 'https://via.placeholder.com/300x200?text=Recipe'}
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <span
            className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
              difficultyColor[recipe.difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>

        {/* Recipe Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Cuisine Badge */}
          <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mb-2 w-fit">
            {recipe.cuisine}
          </span>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
            {recipe.description}
          </p>

          {/* Recipe Meta (Prep Time, Rating) */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {recipe.prepTime && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{recipe.prepTime} min</span>
              </div>
            )}
            {recipe.rating && (
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400" />
                <span>{recipe.rating}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${
                isFavorited
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">
                {isFavorited ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
