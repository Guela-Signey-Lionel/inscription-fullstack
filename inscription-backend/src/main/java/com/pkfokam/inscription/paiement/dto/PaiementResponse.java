package com.pkfokam.inscription.paiement.dto;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
public record PaiementResponse(UUID id, UUID inscriptionId, BigDecimal montant, String devise, String statut, String recuPdfUrl, Instant dateConfirmation) {}
