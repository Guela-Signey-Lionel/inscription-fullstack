package com.pkfokam.inscription.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="utilisateurs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Utilisateur {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false,length=100) private String nom;
    @Column(nullable=false,length=100) private String prenom;
    @Column(nullable=false,unique=true) private String email;
    @Column(name="mot_de_passe") private String motDePasse;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private Role role;
    @Column(nullable=false) private boolean actif;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private Provider provider;
    @Column(name="provider_id") private String providerId;
    @Column(name="tentatives_connexion") private int tentativesConnexion;
    @Column(name="bloque_jusqu_au") private Instant bloqueJusquAu;
    @Column(name="date_creation") private Instant dateCreation;
    @PrePersist void pre() { if (dateCreation==null) dateCreation=Instant.now(); if(provider==null)provider=Provider.LOCAL; if(role==null)role=Role.CANDIDAT; }
}
