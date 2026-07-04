package com.pkfokam.inscription.message.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Message {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="conversation_id", nullable=false)
    private Conversation conversation;

    @Column(name="expediteur_id", nullable=false) private UUID expediteurId;
    @Column(name="expediteur_role", nullable=false, length=20) private String expediteurRole; // admin, candidat
    @Column(nullable=false, columnDefinition="TEXT") private String contenu;
    @Column(name="piece_jointe_url") private String pieceJointeUrl;
    @Column(name="piece_jointe_nom") private String pieceJointeNom;
    @Column(nullable=false) private boolean lu;
    @Column(name="date_envoi", nullable=false) private Instant dateEnvoi;

    @PrePersist void pre() { dateEnvoi=Instant.now(); }
}
