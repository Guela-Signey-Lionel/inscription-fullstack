package com.pkfokam.inscription.paiement.dto;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
public record CreatePaymentIntentRequest(@NotNull UUID inscriptionId) {}
