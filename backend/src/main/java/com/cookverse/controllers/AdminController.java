package com.cookverse.controllers;

import com.cookverse.repositories.FavoriteRepository;
import com.cookverse.repositories.RecipeRepository;
import com.cookverse.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final FavoriteRepository favoriteRepository;

    public AdminController(
            UserRepository userRepository,
            RecipeRepository recipeRepository,
            FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Long> categoryCounts = new LinkedHashMap<>();
        recipeRepository.countRecipesByCategory()
                .forEach(row -> categoryCounts.put((String) row[0], (Long) row[1]));

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalAdmins", userRepository.countByRole("ROLE_ADMIN"));
        stats.put("totalStandardUsers", userRepository.countByRole("ROLE_USER"));
        stats.put("totalRecipes", recipeRepository.count());
        stats.put("userRecipes", recipeRepository.countByCreatedByRole("USER"));
        stats.put("adminRecipes", recipeRepository.countByCreatedByRole("ADMIN"));
        stats.put("totalFavorites", favoriteRepository.count());
        stats.put("recipesByCategory", categoryCounts);

        return ResponseEntity.ok(stats);
    }
}
