package com.pkfokam.inscription.document.dto;
import jakarta.validation.constraints.NotBlank;
public record ValiderDocumentRequest(@NotBlank String statut, String motifRejet) {}
