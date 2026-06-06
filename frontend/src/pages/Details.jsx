import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeAPI } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, Heart, Trash2, Edit, ArrowLeft, Check, Sparkles, AlertCircle 
} from 'lucide-react';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await recipeAPI.getRecipeById(id);
        setRecipe(response.data.recipe);
        setIsFavorite(response.data.isFavorite);
      } catch (err) {
        setError(err.response?.data?.error || 'Recipe not found');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (isFavorite) {
        await recipeAPI.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await recipeAPI.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err) {
      // Toggle failure
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    setDeleteLoading(true);
    try {
      await recipeAPI.deleteRecipe(id);
      navigate(isAdmin ? '/admin/recipes' : '/my-recipes');
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">Recipe Error</h3>
        <p className="mt-2 text-slate-505">{error || 'Could not load recipe details.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-semibold text-white shadow hover:bg-amber-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const isOwner = recipe.createdBy && user && recipe.createdBy.id === user.id;
  const canEdit = isOwner || isAdmin;

  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split('\n').filter((item) => item.trim() !== '')
    : [];
  const stepsList = recipe.steps
    ? recipe.steps.split('\n').filter((item) => item.trim() !== '')
    : [];

  const getImagePath = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';
    if (path.startsWith('http')) return path;
    return path;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-5">
          <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-md dark:bg-slate-800">
            <img
              src={getImagePath(recipe.imageUrl)}
              alt={recipe.title}
              className="h-80 w-full object-cover sm:h-96"
            />
            {recipe.createdByRole === 'ADMIN' && (
              <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
                <Sparkles className="h-4 w-4 animate-pulse" />
                AI Generated
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              {recipe.title}
            </h1>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {recipe.category}
              </span>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {recipe.cuisine}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {recipe.description}
            </p>

            <hr className="my-6 border-slate-200/50 dark:border-slate-800" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-2xs uppercase tracking-wider font-semibold text-slate-400">Cooking Time</p>
                <div className="mt-1 flex items-center justify-center gap-1 text-slate-850 dark:text-slate-200 font-bold">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>{recipe.cookingTime} mins</span>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-2xs uppercase tracking-wider font-semibold text-slate-400">Difficulty</p>
                <p className="mt-1 text-slate-850 dark:text-slate-200 font-bold uppercase tracking-wide">
                  {recipe.difficulty}
                </p>
              </div>
            </div>

            {recipe.createdBy && (
              <div className="mt-6 rounded-xl bg-slate-50/50 p-3.5 dark:bg-slate-950/20 text-xs text-slate-500 border border-slate-100 dark:border-slate-800">
                Uploaded by: <span className="font-semibold text-slate-700 dark:text-slate-300">{recipe.createdBy.name}</span> ({recipe.createdByRole})
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {isAuthenticated && !isAdmin && (
              <button
                onClick={handleFavoriteToggle}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold shadow-sm transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-55/10 text-red-650 border border-red-200 hover:bg-red-50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
            )}

            {canEdit && (
              <>
                <Link
                  to={`/edit-recipe/${recipe.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-805 transition-colors"
                >
                  <Edit className="h-4.5 w-4.5" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 shadow-sm hover:bg-red-100 dark:border-red-950 dark:bg-red-950/30 dark:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ingredients</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Check them off as you prepare the meal</p>
            
            <ul className="mt-5 space-y-3">
              {ingredientsList.map((item, idx) => {
                const isChecked = checkedIngredients.includes(idx);
                return (
                  <li
                    key={idx}
                    onClick={() => handleIngredientCheck(idx)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-950"
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-md border text-white transition-all ${
                      isChecked 
                        ? 'border-amber-500 bg-amber-500' 
                        : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-sm text-slate-700 dark:text-slate-300 transition-all ${
                      isChecked ? 'line-through text-slate-450 dark:text-slate-650' : ''
                    }`}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Preparation Steps</h3>
            
            <ol className="mt-6 space-y-6">
              {stepsList.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
