package com.pkfokam.inscription.inscription.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity @Table(name="formations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Formation {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false) private String nom;
    @Column(nullable=false,unique=true) private String code;
    @Column(nullable=false) private String filiere;
    @Column(nullable=false) private String niveau;
    @Column(name="places_disponibles",nullable=false) private int placesDisponibles;
    @Column(name="places_total",nullable=false) private int placesTotal;
    @Column(name="frais_inscription",nullable=false) private BigDecimal fraisInscription;
    @Column(columnDefinition="TEXT") private String prerequis;
    @Column(columnDefinition="TEXT") private String description;
    @Column(nullable=false) private boolean actif;
}
