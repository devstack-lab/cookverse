import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/recipeService';
import { Trash2, Edit, Eye, Plus, Calendar, BookOpen } from 'lucide-react';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await recipeAPI.getMyRecipes();
        setRecipes(response.data);
      } catch (err) {
        // Fetch failure
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await recipeAPI.deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const getImagePath = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';
    if (path.startsWith('http')) return path;
    return path;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Recipes
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View, modify, and manage the recipes you have shared with the CookVerse community.
          </p>
        </div>
        <Link
          to="/add-recipe"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white shadow hover:bg-amber-600 transition-colors"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Recipe
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="mt-12 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-350">No Uploaded Recipes</h3>
          <p className="mt-1 text-sm text-slate-500">You haven't contributed any recipes yet. Share your secret dish today!</p>
          <Link
            to="/add-recipe"
            className="mt-6 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-amber-600 transition-colors"
          >
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm dark:border-slate-800/50 dark:bg-slate-900 transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  <th className="px-6 py-4">Recipe Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImagePath(recipe.imageUrl)}
                          alt={recipe.title}
                          className="h-12 w-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{recipe.title}</div>
                          <div className="text-xs text-slate-400">{recipe.cuisine}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {recipe.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-505 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/recipe/${recipe.id}`)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                          title="View"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-950 dark:bg-red-950/20 dark:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
