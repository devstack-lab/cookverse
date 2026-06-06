import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recipeAPI } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import { Search as SearchIcon, RotateCcw, Frown } from 'lucide-react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');

  useEffect(() => {
    const q = searchParams.get('query') || '';
    const cat = searchParams.get('category') || '';
    const diff = searchParams.get('difficulty') || '';

    setQuery(q);
    setCategory(cat);
    setDifficulty(diff);

    const executeSearch = async () => {
      setLoading(true);
      try {
        const response = await recipeAPI.searchRecipes(q, cat, diff);
        setRecipes(response.data);

        const token = localStorage.getItem('token');
        if (token) {
          const favRes = await recipeAPI.getFavorites();
          setFavorites(favRes.data.map(f => f.id));
        }
      } catch (err) {
        // Fallback or logs
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams();
  };

  const updateParams = (newCat = category, newDiff = difficulty) => {
    const params = {};
    if (query) params.query = query;
    if (newCat) params.category = newCat;
    if (newDiff) params.difficulty = newDiff;
    setSearchParams(params);
  };

  const handleCategorySelect = (cat) => {
    const nextCat = category === cat ? '' : cat;
    setCategory(nextCat);
    updateParams(nextCat, difficulty);
  };

  const handleDifficultySelect = (diff) => {
    const nextDiff = difficulty === diff ? '' : diff;
    setDifficulty(nextDiff);
    updateParams(category, nextDiff);
  };

  const handleReset = () => {
    setQuery('');
    setCategory('');
    setDifficulty('');
    setSearchParams({});
  };

  const handleFavoriteToggle = async (recipeId) => {
    try {
      if (favorites.includes(recipeId)) {
        await recipeAPI.removeFavorite(recipeId);
        setFavorites(prev => prev.filter(id => id !== recipeId));
      } else {
        await recipeAPI.addFavorite(recipeId);
        setFavorites(prev => [...prev, recipeId]);
      }
    } catch (err) {
      // Toggle error
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Search Recipes
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Discover, query, and filter recipes by ingredients, categories, and preparation levels.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        {/* Filters Panel */}
        <div className="space-y-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-850 dark:text-white">Filters</h3>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All
            </button>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="recipe-search" className="block text-sm font-medium text-slate-750 dark:text-slate-300">
              Keyword or Ingredient
            </label>
            <div className="relative mt-2 rounded-xl shadow-sm">
              <input
                id="recipe-search"
                type="text"
                placeholder="paneer, onion, tomato..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-450 hover:text-amber-500"
                aria-label="Submit search"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>
          </form>

          <hr className="border-slate-200/50 dark:border-slate-800" />

          <div>
            <h4 className="text-sm font-semibold text-slate-750 dark:text-slate-300">Category</h4>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                    category === cat
                      ? 'bg-amber-500/10 text-amber-600 font-semibold dark:bg-amber-500/20 dark:text-amber-400'
                      : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-200/50 dark:border-slate-800" />

          <div>
            <h4 className="text-sm font-semibold text-slate-750 dark:text-slate-300">Difficulty</h4>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultySelect(diff)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                    difficulty === diff
                      ? 'bg-amber-500/10 text-amber-600 font-semibold dark:bg-amber-500/20 dark:text-amber-400'
                      : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span>{diff}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-900">
                <Frown className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">No Recipes Found</h3>
              <p className="mt-1 text-sm text-slate-500">We couldn't find any recipes matching your current filter selections.</p>
              <button
                onClick={handleReset}
                className="mt-4 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-amber-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favorites.includes(recipe.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
