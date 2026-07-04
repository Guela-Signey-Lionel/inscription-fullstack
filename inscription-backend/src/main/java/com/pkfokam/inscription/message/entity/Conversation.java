package com.pkfokam.inscription.message.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.*;

@Entity @Table(name="conversations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Conversation {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="candidat_id", nullable=false) private UUID candidatId;
    @Column(name="inscription_id") private UUID inscriptionId;
    @Column(nullable=false) private String objet;
    @Column(nullable=false, length=20) private String statut; // actif, resolu, ferme
    @Column(name="date_creation", nullable=false) private Instant dateCreation;
    @Column(name="date_modification") private Instant dateModification;

    @OneToMany(mappedBy="conversation", cascade=CascadeType.ALL, fetch=FetchType.LAZY, orphanRemoval=true)
    @OrderBy("dateEnvoi ASC")
    private List<Message> messages = new ArrayList<>();

    @PrePersist void pre() { dateCreation=Instant.now(); if(statut==null)statut="actif"; }
    @PreUpdate void preUpdate() { dateModification=Instant.now(); }
}
