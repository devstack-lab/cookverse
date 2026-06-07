package com.cookverse.services;

import com.cookverse.dto.RecipeRequest;
import com.cookverse.models.Favorite;
import com.cookverse.models.Recipe;
import com.cookverse.models.User;
import com.cookverse.repositories.FavoriteRepository;
import com.cookverse.repositories.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public List<Recipe> getFeaturedRecipes() {
        return recipeRepository.findTop6ByOrderByCreatedAtDesc();
    }

    public List<Recipe> searchRecipes(String query, String category, String difficulty) {
        return recipeRepository.searchRecipes(query, category, difficulty);
    }

    public Recipe getRecipeById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipe not found with id: " + id));
    }

    @Transactional
    public Recipe createRecipe(RecipeRequest request, User user) {
        String roleStr = user.getRole().equals("ROLE_ADMIN") ? "ADMIN" : "USER";
        
        Recipe recipe = Recipe.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .cuisine(request.getCuisine())
                .description(request.getDescription())
                .ingredients(request.getIngredients())
                .steps(request.getSteps())
                .cookingTime(request.getCookingTime())
                .difficulty(request.getDifficulty())
                .imageUrl(request.getImageUrl())
                .createdBy(user)
                .createdByRole(roleStr)
                .build();
                
        return recipeRepository.save(recipe);
    }

    @Transactional
    public Recipe updateRecipe(Long id, RecipeRequest request, User user) {
        Recipe recipe = getRecipeById(id);

        // Allow update only if user is the author or an admin
        boolean isAuthor = recipe.getCreatedBy() != null && recipe.getCreatedBy().getId().equals(user.getId());
        boolean isAdmin = user.getRole().equals("ROLE_ADMIN");

        if (!isAuthor && !isAdmin) {
            throw new SecurityException("You are not authorized to update this recipe");
        }

        recipe.setTitle(request.getTitle());
        recipe.setCategory(request.getCategory());
        recipe.setCuisine(request.getCuisine());
        recipe.setDescription(request.getDescription());
        recipe.setIngredients(request.getIngredients());
        recipe.setSteps(request.getSteps());
        recipe.setCookingTime(request.getCookingTime());
        recipe.setDifficulty(request.getDifficulty());
        
        if (request.getImageUrl() != null) {
            recipe.setImageUrl(request.getImageUrl());
        }

        return recipeRepository.save(recipe);
    }

    @Transactional
    public void deleteRecipe(Long id, User user) {
        Recipe recipe = getRecipeById(id);

        boolean isAuthor = recipe.getCreatedBy() != null && recipe.getCreatedBy().getId().equals(user.getId());
        boolean isAdmin = user.getRole().equals("ROLE_ADMIN");

        if (!isAuthor && !isAdmin) {
            throw new SecurityException("You are not authorized to delete this recipe");
        }

        favoriteRepository.deleteByRecipeId(id);
        recipeRepository.delete(recipe);
    }

    public List<Recipe> getRecipesByUser(Long userId) {
        return recipeRepository.findByCreatedById(userId);
    }

    // --- Favorites Logic ---

    @Transactional
    public void addFavorite(Long recipeId, User user) {
        Recipe recipe = getRecipeById(recipeId);
        if (favoriteRepository.existsByUserIdAndRecipeId(user.getId(), recipeId)) {
            return; // Already favorited
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .recipe(recipe)
                .build();

        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long recipeId, User user) {
        if (!favoriteRepository.existsByUserIdAndRecipeId(user.getId(), recipeId)) {
            throw new IllegalArgumentException("Recipe is not in favorites");
        }
        favoriteRepository.deleteByUserIdAndRecipeId(user.getId(), recipeId);
    }

    public List<Recipe> getUserFavorites(User user) {
        List<Favorite> favorites = favoriteRepository.findByUserId(user.getId());
        return favorites.stream()
                .map(Favorite::getRecipe)
                .collect(Collectors.toList());
    }

    public boolean isFavorite(Long recipeId, User user) {
        if (user == null) return false;
        return favoriteRepository.existsByUserIdAndRecipeId(user.getId(), recipeId);
    }
}
