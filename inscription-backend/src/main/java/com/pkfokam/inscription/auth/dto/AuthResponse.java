package com.pkfokam.inscription.auth.dto;
import com.pkfokam.inscription.auth.entity.Role;
import java.util.UUID;
public record AuthResponse(String accessToken, String refreshToken, String tokenType, long expiresIn, UserInfo utilisateur) {
    public record UserInfo(UUID id, String nom, String prenom, String email, Role role) {}
}
