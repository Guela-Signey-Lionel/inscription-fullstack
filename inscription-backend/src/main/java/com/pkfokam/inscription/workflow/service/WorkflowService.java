package com.pkfokam.inscription.workflow.service;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.*;

@Entity
@jakarta.persistence.Table(name="historique_workflow")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
class HistoriqueWorkflow {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="inscription_id",nullable=false) private UUID inscriptionId;
    @Column(name="etat_depart") private String etatDepart;
    @Column(name="etat_arrivee",nullable=false) private String etatArrivee;
    private String evenement;
    @Column(name="acteur_id") private UUID acteurId;
    @Column(columnDefinition="TEXT") private String motif;
    @Column(name="date_transition") private Instant dateTransition;
    @PrePersist void pre() { dateTransition=Instant.now(); }
}

interface HistoriqueWorkflowRepository extends org.springframework.data.jpa.repository.JpaRepository<HistoriqueWorkflow, UUID> {
    List<HistoriqueWorkflow> findByInscriptionIdOrderByDateTransitionAsc(UUID inscriptionId);
}

@Service
@Transactional
@RequiredArgsConstructor
public class WorkflowService {
    private final HistoriqueWorkflowRepository historiqueRepo;

    public void enregistrerTransition(UUID inscriptionId, String etatDepart, String etatArrivee, String evenement, UUID acteurId, String motif) {
        historiqueRepo.save(HistoriqueWorkflow.builder()
            .inscriptionId(inscriptionId).etatDepart(etatDepart).etatArrivee(etatArrivee)
            .evenement(evenement).acteurId(acteurId).motif(motif).build());
    }

    @Transactional(readOnly=true)
    public List<HistoriqueWorkflow> getHistorique(UUID inscriptionId) {
        return historiqueRepo.findByInscriptionIdOrderByDateTransitionAsc(inscriptionId);
    }
}
