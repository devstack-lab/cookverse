import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import { Sparkles, Compass, ChefHat } from 'lucide-react';

const CATEGORY_METADATA = [
  { name: 'Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400' },
  { name: 'Lunch', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400' },
  { name: 'Dinner', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400' },
  { name: 'Snacks', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400' },
  { name: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400' }
];

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch featured (latest) and favorites
        const recipeRes = await recipeAPI.searchRecipes();
        setRecipes(recipeRes.data.slice(0, 6)); // Display latest 6

        // Compute counts per category dynamically
        const counts = {};
        recipeRes.data.forEach(r => {
          counts[r.category] = (counts[r.category] || 0) + 1;
        });
        setCategoryCounts(counts);

        // Fetch user favorites if logged in
        const token = localStorage.getItem('token');
        if (token) {
          const favRes = await recipeAPI.getFavorites();
          setFavorites(favRes.data.map(f => f.id));
        }
      } catch (err) {
        // Graceful error handle
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

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
      // Error toggling favorite
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/search?category=${categoryName}`);
  };

  return (
    <div className="space-y-16 pb-16 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-400 backdrop-blur-sm border border-amber-500/20">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Next Gen Recipe Discovery
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Discover Amazing Recipes <br />
            with <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">CookVerse AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Browse culinary favorites curated by the community or harness Gemini AI to generate custom, structured recipes instantly from whatever you have in the fridge.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/search"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all duration-200"
            >
              <Compass className="h-5 w-5" />
              Explore Recipes
            </Link>
            <Link
              to="/generate-ai"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 font-bold text-slate-100 backdrop-blur-sm hover:bg-slate-800 transition-all duration-200"
            >
              <Sparkles className="h-5 w-5 text-amber-400" />
              Generate Recipe
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Browse by Category
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Find the perfect meal option for any time of the day
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_METADATA.map((cat) => {
            const count = categoryCounts[cat.name] || 0;
            return (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900"
              >
                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/25"></div>
                </div>
                <div className="mt-3 text-center sm:text-left">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {count} {count === 1 ? 'recipe' : 'recipes'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Featured Recipes
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Check out some of our latest mouth-watering submissions
            </p>
          </div>
          <Link
            to="/search"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            View All Recipes
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-350 p-12 text-center dark:border-slate-800">
            <ChefHat className="h-12 w-12 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">No Recipes Found</h3>
            <p className="mt-1 text-sm text-slate-500">Be the first to upload a recipe to the community!</p>
            <Link
              to="/add-recipe"
              className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600"
            >
              Add a Recipe
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>
    </div>
  );
};

export default Home;
