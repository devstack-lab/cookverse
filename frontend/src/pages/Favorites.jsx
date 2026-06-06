import React, { useEffect, useState } from 'react';
import { recipeAPI } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await recipeAPI.getFavorites();
        setRecipes(response.data);
      } catch (err) {
        // Fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteToggle = async (recipeId) => {
    try {
      await recipeAPI.removeFavorite(recipeId);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (err) {
      // Toggle failure
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          My Saved Favorites
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Access all your bookmarked community and AI-generated recipe guides in one place.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="mt-12 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/20">
            <Heart className="h-6 w-6 fill-red-500" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-350">No Favorites Bookmarked</h3>
          <p className="mt-1 text-sm text-slate-500 font-medium">Explore recipes and click the heart icon to save them here!</p>
          <Link
            to="/search"
            className="mt-6 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-amber-600 transition-colors"
          >
            Explore Recipes
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
