import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/recipeService';
import { Edit, Eye, RefreshCw, Search, Trash2 } from 'lucide-react';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRecipes = async (nextQuery = query) => {
    setLoading(true);
    setError('');
    try {
      const response = await recipeAPI.searchRecipes(nextQuery);
      setRecipes(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes('');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipes(query);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe permanently?')) return;
    try {
      await recipeAPI.deleteRecipe(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const getImagePath = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';
    if (path.startsWith('http')) return path;
    return path;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Manage Recipes
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Review, edit, and remove any recipe in the CookVerse catalog.
          </p>
        </div>
        <button
          onClick={() => fetchRecipes(query)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="relative max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or ingredient"
            className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-amber-500"
            aria-label="Search recipes"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No recipes found.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  <th className="px-6 py-4">Recipe</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Created By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/30">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImagePath(recipe.imageUrl)}
                          alt={recipe.title}
                          className="h-12 w-12 rounded-lg bg-slate-100 object-cover dark:bg-slate-800"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{recipe.title}</p>
                          <p className="text-xs text-slate-400">{recipe.cuisine}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {recipe.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {recipe.createdByRole}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {recipe.createdBy?.name || 'Unknown'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/recipe/${recipe.id}`)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-950 dark:bg-red-950/20 dark:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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

export default AdminRecipes;
