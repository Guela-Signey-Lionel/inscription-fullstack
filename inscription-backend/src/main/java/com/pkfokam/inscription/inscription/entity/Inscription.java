package com.pkfokam.inscription.inscription.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Entity @Table(name="inscriptions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Inscription {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="numero_reference",nullable=false,unique=true) private String numeroReference;
    @Column(name="candidat_id",nullable=false) private UUID candidatId;

    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="formation_id")
    private Formation formation;

    @Column(nullable=false,length=30) private String statut;
    @Column(name="type_inscription",length=30) private String typeInscription;
    @Column(name="annee_academique") private String anneeAcademique;
    @Column(name="agent_scolarite_id") private UUID agentScolariteId;
    @Column(name="agent_financier_id") private UUID agentFinancierId;
    @Column(name="validation_scolarite") private boolean validationScolarite;
    @Column(name="validation_financier") private boolean validationFinancier;
    @Column(name="motif_rejet",columnDefinition="TEXT") private String motifRejet;
    // Infos personnelles
    @Column(name="date_naissance") private LocalDate dateNaissance;
    private String sexe;
    private String nationalite;
    private String telephone;
    @Column(columnDefinition="TEXT") private String adresse;
    @Column(name="photo_url") private String photoUrl;
    @Column(name="email_verifie") private boolean emailVerifie;
    // Dates
    @Column(name="date_soumission") private Instant dateSoumission;
    @Column(name="date_traitement") private Instant dateTraitement;
    @Column(name="date_expiration") private Instant dateExpiration;
    @Column(name="date_creation") private Instant dateCreation;
    @Column(name="date_modification") private Instant dateModification;

    @PrePersist void pre() { dateCreation=Instant.now(); statut="BROUILLON"; dateExpiration=Instant.now().plus(30, java.time.temporal.ChronoUnit.DAYS); }
    @PreUpdate void preUpdate() { dateModification=Instant.now(); }
}
