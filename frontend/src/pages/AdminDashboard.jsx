import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../services/recipeService';
import { BarChart3, BookOpen, Heart, ShieldCheck, Sparkles, Users } from 'lucide-react';

const statItems = [
  { key: 'totalRecipes', label: 'Recipes', icon: BookOpen },
  { key: 'totalUsers', label: 'Users', icon: Users },
  { key: 'totalFavorites', label: 'Favorites', icon: Heart },
  { key: 'totalAdmins', label: 'Admins', icon: ShieldCheck },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await recipeAPI.getStats();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const categories = stats?.recipesByCategory
    ? Object.entries(stats.recipesByCategory)
    : [];

  const maxCategoryCount = Math.max(1, ...categories.map(([, count]) => count));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Monitor platform activity, recipe sources, and category distribution.
          </p>
        </div>
        <Link
          to="/admin/recipes"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-amber-600"
        >
          <BookOpen className="h-4 w-4" />
          Manage Recipes
        </Link>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="mt-8 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map(({ key, label, icon: Icon }) => (
              <div
                key={key}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                      {stats?.[key] ?? 0}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recipe Source</h2>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Community</p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {stats?.userRecipes ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin / AI</p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {stats?.adminRecipes ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Categories</h2>
              </div>
              <div className="mt-6 space-y-4">
                {categories.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No recipes have been added yet.</p>
                ) : (
                  categories.map(([category, count]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span>{category}</span>
                        <span>{count}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-amber-500"
                          style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
