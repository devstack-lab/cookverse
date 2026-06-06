package com.cookverse.repositories;

import com.cookverse.models.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByCreatedById(Long userId);
    
    long countByCreatedByRole(String role);
    
    @Query("SELECT r FROM Recipe r WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.ingredients) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR r.category = :category) AND " +
           "(:difficulty IS NULL OR :difficulty = '' OR r.difficulty = :difficulty)")
    List<Recipe> searchRecipes(@Param("query") String query, 
                               @Param("category") String category, 
                               @Param("difficulty") String difficulty);
                               
    @Query("SELECT r.category, COUNT(r) FROM Recipe r GROUP BY r.category")
    List<Object[]> countRecipesByCategory();
    
    List<Recipe> findTop6ByOrderByCreatedAtDesc();
}
