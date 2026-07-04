package com.pkfokam.inscription.paiement.dto;
import java.math.BigDecimal;
public record PaymentIntentResponse(String clientSecret, String paymentIntentId, BigDecimal montant, String devise, String publishableKey) {}
