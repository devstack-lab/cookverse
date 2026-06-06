import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/recipeService';
import { ArrowLeft, Upload, RefreshCw, ChefHat } from 'lucide-react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const RecipeForm = () => {
  const { id } = useParams(); // Exists if we are in Edit Mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [cuisine, setCuisine] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchRecipe = async () => {
        setFetchLoading(true);
        try {
          const response = await recipeAPI.getRecipeById(id);
          const r = response.data.recipe;
          setTitle(r.title);
          setCategory(r.category);
          setCuisine(r.cuisine);
          setDescription(r.description);
          setCookingTime(r.cookingTime.toString());
          setDifficulty(r.difficulty);
          setIngredients(r.ingredients);
          setSteps(r.steps);
          setImageUrl(r.imageUrl || '');
          if (r.imageUrl) {
            setImagePreview(r.imageUrl);
          }
        } catch (err) {
          setError('Failed to load recipe details for editing.');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !cuisine || !description || !cookingTime || !ingredients || !steps) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = imageUrl;

      // Handle image upload if a file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await recipeAPI.uploadImage(formData);
        finalImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        title,
        category,
        cuisine,
        description,
        cookingTime: parseInt(cookingTime),
        difficulty,
        ingredients,
        steps,
        imageUrl: finalImageUrl
      };

      if (isEditMode) {
        await recipeAPI.updateRecipe(id, payload);
      } else {
        await recipeAPI.createRecipe(payload);
      }

      navigate(isEditMode ? `/recipe/${id}` : '/my-recipes');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save recipe.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Cancel
      </button>

      <div className="mt-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-850">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-550">
            <ChefHat className="h-5.5 w-5.5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Recipe' : 'Add New Recipe'}
          </h2>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-350">
                Recipe Title *
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g. Paneer Butter Masala"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-slate-700 dark:text-slate-350">
                Cuisine Category *
              </label>
              <input
                id="cuisine"
                type="text"
                required
                placeholder="e.g. Indian, Italian, Mexican"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-350">
                Meal Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cookingTime" className="block text-sm font-medium text-slate-700 dark:text-slate-355">
                  Cooking Time (mins) *
                </label>
                <input
                  id="cookingTime"
                  type="number"
                  required
                  min="1"
                  placeholder="30"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-355">
                  Difficulty Level *
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-355">
              Recipe Description *
            </label>
            <textarea
              id="description"
              required
              rows="3"
              placeholder="Provide a brief summary detailing flavor, aroma, and general remarks about the dish..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Detailed textareas */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-slate-700 dark:text-slate-355">
                Ingredients (One item per line) *
              </label>
              <textarea
                id="ingredients"
                required
                rows="6"
                placeholder="200g Paneer&#10;2 Tomatoes&#10;1 Onion&#10;2 tbsp Butter"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="steps" className="block text-sm font-medium text-slate-700 dark:text-slate-355">
                Preparation Steps (One step per line) *
              </label>
              <textarea
                id="steps"
                required
                rows="6"
                placeholder="Heat oil in a pan&#10;Add onions and tomatoes and sauté&#10;Add spices and cook for 5 minutes&#10;Stir in paneer cubes and cream"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Image Uploader Component */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-355">Recipe Image</label>
            <div className="mt-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 dark:border-slate-800">
              {imagePreview ? (
                <div className="text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-40 max-w-xs rounded-xl object-cover shadow"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setImageUrl('');
                    }}
                    className="mt-3 text-xs font-semibold text-red-500 hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-10 w-10 text-slate-400" />
                  <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-amber-500 hover:text-amber-600 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-xs text-slate-450 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow-md shadow-amber-500/10 hover:bg-amber-600 transition-colors"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update Recipe' : 'Publish Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
