package com.pkfokam.inscription.document.repository;

import com.pkfokam.inscription.document.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByInscriptionId(UUID inscriptionId);
    boolean existsByInscriptionIdAndStatutNot(UUID inscriptionId, String statut);
    long countByInscriptionIdAndStatut(UUID inscriptionId, String statut);
}
