package com.pkfokam.inscription.utilisateur.dto;

import com.pkfokam.inscription.auth.entity.Role;
import java.time.Instant;
import java.util.UUID;

public record UtilisateurResponse(
    UUID id,
    String nom,
    String prenom,
    String email,
    Role role,
    boolean actif,
    String provider,
    Instant dateCreation
) {}
