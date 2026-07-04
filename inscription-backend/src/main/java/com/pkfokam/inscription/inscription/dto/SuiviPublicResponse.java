package com.pkfokam.inscription.inscription.dto;
import java.time.Instant;
public record SuiviPublicResponse(String numeroReference, String statut, Instant dateCreation, Instant dateSoumission, String formationNom) {}
