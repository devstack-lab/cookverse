package com.cookverse.services;

import com.cookverse.dto.RegisterRequest;
import com.cookverse.dto.UserProfileResponse;
import com.cookverse.models.User;
import com.cookverse.repositories.FavoriteRepository;
import com.cookverse.repositories.RecipeRepository;
import com.cookverse.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        String rawRole = request.getRole();
        String role = "ROLE_USER";
        if (rawRole != null && !rawRole.trim().isEmpty()) {
            String upperRole = rawRole.toUpperCase().trim();
            if (upperRole.startsWith("ROLE_")) {
                role = upperRole;
            } else {
                role = "ROLE_" + upperRole;
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        return userRepository.save(user);
    }

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long recipeCount = recipeRepository.findByCreatedById(userId).size();
        long favoriteCount = favoriteRepository.findByUserId(userId).size();

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .uploadedRecipesCount(recipeCount)
                .favoriteRecipesCount(favoriteCount)
                .build();
    }

    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid current password");
        }

        if (newPassword == null || newPassword.trim().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public User updateProfile(Long userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }
        return userRepository.save(user);
    }
}
