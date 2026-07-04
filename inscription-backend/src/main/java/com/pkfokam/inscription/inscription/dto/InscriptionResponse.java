package com.pkfokam.inscription.inscription.dto;

import java.time.*;
import java.util.UUID;

public record InscriptionResponse(
    UUID id, String numeroReference, UUID candidatId, String candidatNom,
    String formationNom, String formationCode, String statut,
    String typeInscription, String anneeAcademique,
    LocalDate dateNaissance, String sexe, String nationalite, String telephone, String adresse,
    boolean emailVerifie, Instant dateCreation, Instant dateSoumission
) {}
