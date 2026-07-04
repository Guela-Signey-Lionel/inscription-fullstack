package com.pkfokam.inscription.notification.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false) private String action;
    private String ressource;
    @Column(name="ressource_id") private String ressourceId;
    @Column(name="acteur_id") private UUID acteurId;
    @Column(name="acteur_email") private String acteurEmail;
    @Column(name="adresse_ip") private String adresseIp;
    @Column(name="user_agent") private String userAgent;
    @Column(name="date_action") private Instant dateAction;
    @PrePersist void pre() { dateAction=Instant.now(); }
}
