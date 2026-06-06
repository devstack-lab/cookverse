import api from './api';

export const recipeAPI = {
  searchRecipes: (query = '', category = '', difficulty = '') => {
    return api.get('/api/recipes', {
      params: { query, category, difficulty }
    });
  },
  
  getFeaturedRecipes: () => {
    return api.get('/api/recipes/featured');
  },
  
  getRecipeById: (id) => {
    return api.get(`/api/recipes/${id}`);
  },
  
  createRecipe: (payload) => {
    return api.post('/api/recipes', payload);
  },
  
  updateRecipe: (id, payload) => {
    return api.put(`/api/recipes/${id}`, payload);
  },
  
  deleteRecipe: (id) => {
    return api.delete(`/api/recipes/${id}`);
  },
  
  getMyRecipes: () => {
    return api.get('/api/recipes/my');
  },
  
  uploadImage: (formData) => {
    return api.post('/api/recipes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Favorites
  getFavorites: () => {
    return api.get('/api/favorites');
  },
  
  addFavorite: (recipeId) => {
    return api.post(`/api/favorites/${recipeId}`);
  },
  
  removeFavorite: (recipeId) => {
    return api.delete(`/api/favorites/${recipeId}`);
  },

  // Stats (Admin)
  getStats: () => {
    return api.get('/api/admin/stats');
  }
};
