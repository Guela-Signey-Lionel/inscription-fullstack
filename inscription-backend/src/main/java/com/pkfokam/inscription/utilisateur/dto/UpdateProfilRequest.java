package com.pkfokam.inscription.utilisateur.dto;

public record UpdateProfilRequest(
    String nom,
    String prenom,
    String telephone,
    String adresse,
    String bio,
    String avatarUrl
) {}
