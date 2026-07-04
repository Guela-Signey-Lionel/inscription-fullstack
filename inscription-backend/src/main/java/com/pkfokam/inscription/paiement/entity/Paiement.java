package com.pkfokam.inscription.paiement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="paiements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Paiement {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="inscription_id",nullable=false,unique=true) private UUID inscriptionId;
    @Column(name="stripe_payment_intent_id",nullable=false,unique=true) private String stripePaymentIntentId;
    @Column(name="idempotency_key",nullable=false,unique=true) private String idempotencyKey;
    @Column(nullable=false) private BigDecimal montant;
    @Column(nullable=false,length=10) private String devise;
    @Column(nullable=false,length=20) private String statut;
    @Column(name="stripe_charge_id") private String stripeChargeId;
    @Column(name="recu_pdf_url") private String recuPdfUrl;
    @Column(name="date_confirmation") private Instant dateConfirmation;
    @Column(name="date_remboursement") private Instant dateRemboursement;
    @Column(name="date_creation") private Instant dateCreation;
    @PrePersist void pre() { dateCreation=Instant.now(); statut="PENDING"; }
}
