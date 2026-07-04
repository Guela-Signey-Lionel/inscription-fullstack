package com.pkfokam.inscription.auth.dto;
import jakarta.validation.constraints.*;
public record RegisterRequest(@NotBlank String nom, @NotBlank String prenom, @NotBlank @Email String email, @NotBlank @Size(min=8) String motDePasse) {}
