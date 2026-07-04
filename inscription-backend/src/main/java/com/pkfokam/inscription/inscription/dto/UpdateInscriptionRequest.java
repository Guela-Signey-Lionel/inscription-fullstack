package com.pkfokam.inscription.inscription.dto;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateInscriptionRequest(
    String nom, String prenom, LocalDate dateNaissance, String sexe, String nationalite,
    String telephone, String adresse, UUID formationId, String typeInscription, String anneeAcademique
) {}
