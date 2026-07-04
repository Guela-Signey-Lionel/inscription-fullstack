package com.pkfokam.inscription.document.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.*;

@Entity @Table(name="documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Document {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="inscription_id",nullable=false) private UUID inscriptionId;
    @Column(name="type_document",nullable=false,length=50) private String typeDocument;
    @Column(name="nom_original",nullable=false) private String nomOriginal;
    @Column(name="nom_stockage",nullable=false,unique=true) private String nomStockage;
    @Column(name="mime_type",nullable=false,length=100) private String mimeType;
    @Column(nullable=false) private long taille;
    @Column(nullable=false,length=20) private String statut;
    @Column(name="motif_rejet",columnDefinition="TEXT") private String motifRejet;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name="donnees_ocr",columnDefinition="jsonb") private Map<String,Object> donneesOcr;
    @Column(name="validateur_id") private UUID validateurId;
    @Column(name="date_upload") private Instant dateUpload;
    @Column(name="date_validation") private Instant dateValidation;
    @PrePersist void pre() { dateUpload=Instant.now(); statut="EN_ATTENTE"; }
}
