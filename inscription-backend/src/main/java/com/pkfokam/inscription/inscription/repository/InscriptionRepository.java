package com.pkfokam.inscription.inscription.repository;

import com.pkfokam.inscription.inscription.entity.Inscription;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.*;

public interface InscriptionRepository extends JpaRepository<Inscription, UUID> {
    Page<Inscription> findByStatut(String statut, Pageable pageable);
    Optional<Inscription> findByNumeroReference(String ref);
    List<Inscription> findByCandidatId(UUID candidatId);

    @Query("SELECT i FROM Inscription i WHERE i.statut='BROUILLON' AND i.dateCreation < :since")
    List<Inscription> findBrouillonsAnciens(@Param("since") Instant since);

    @Query("SELECT i FROM Inscription i WHERE i.statut='EN_ATTENTE_COMPLEMENT' AND i.dateExpiration < :now")
    List<Inscription> findExpires(@Param("now") Instant now);

    @Query("""
        SELECT i FROM Inscription i WHERE
        (:statut IS NULL OR i.statut=:statut)
        AND (:formation IS NULL OR i.formation.filiere=:formation)
        ORDER BY i.dateCreation DESC
    """)
    Page<Inscription> findFiltered(@Param("statut") String statut, @Param("formation") String formation, Pageable pageable);

    long countByStatut(String statut);
}
