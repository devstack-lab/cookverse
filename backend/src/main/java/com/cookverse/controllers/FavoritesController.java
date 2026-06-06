package com.cookverse.controllers;

import com.cookverse.models.Recipe;
import com.cookverse.security.CustomUserDetails;
import com.cookverse.services.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoritesController {

    @Autowired
    private RecipeService recipeService;

    @GetMapping
    public ResponseEntity<?> getFavorites(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        List<Recipe> favorites = recipeService.getUserFavorites(userDetails.getUser());
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/{recipeId}")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long recipeId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        try {
            recipeService.addFavorite(recipeId, userDetails.getUser());
            return ResponseEntity.ok(Map.of("message", "Recipe added to favorites"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long recipeId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        try {
            recipeService.removeFavorite(recipeId, userDetails.getUser());
            return ResponseEntity.ok(Map.of("message", "Recipe removed from favorites"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
