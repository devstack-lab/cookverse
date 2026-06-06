package com.cookverse.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecipeRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Cuisine is required")
    private String cuisine;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Ingredients are required")
    private String ingredients;

    @NotBlank(message = "Steps are required")
    private String steps;

    @NotNull(message = "Cooking time is required")
    @Min(value = 1, message = "Cooking time must be at least 1 minute")
    private Integer cookingTime;

    @NotBlank(message = "Difficulty is required")
    private String difficulty; // "Easy", "Medium", "Hard"

    private String imageUrl;
}
