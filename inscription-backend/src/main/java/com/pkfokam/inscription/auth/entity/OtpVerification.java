package com.pkfokam.inscription.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="otp_verifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OtpVerification {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false) private String email;
    @Column(name="code_hash",nullable=false) private String codeHash;
    @Column(nullable=false) private Instant expiration;
    @Column(nullable=false) private boolean utilise;
    @Column(name="date_creation") private Instant dateCreation;
    @PrePersist void pre() { dateCreation=Instant.now(); }
}
