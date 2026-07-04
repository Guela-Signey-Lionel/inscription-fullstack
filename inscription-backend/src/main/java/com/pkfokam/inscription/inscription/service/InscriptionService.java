package com.pkfokam.inscription.inscription.service;

import com.pkfokam.inscription.auth.repository.UtilisateurRepository;
import com.pkfokam.inscription.inscription.dto.*;
import com.pkfokam.inscription.inscription.entity.*;
import com.pkfokam.inscription.inscription.repository.*;
import com.pkfokam.inscription.notification.service.NotificationService;
import com.pkfokam.inscription.shared.exception.*;
import com.pkfokam.inscription.shared.util.PagedResponse;
import com.pkfokam.inscription.workflow.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional
public class InscriptionService {
    private final InscriptionRepository inscriptionRepo;
    private final FormationRepository formationRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final WorkflowService workflowService;
    private final NotificationService notificationService;

    public InscriptionResponse creer(UUID candidatId, CreateInscriptionRequest req) {
        String reference = "REF-" + System.currentTimeMillis();
        Inscription i = Inscription.builder()
            .numeroReference(reference).candidatId(candidatId)
            .typeInscription(req.typeInscription()).anneeAcademique(req.anneeAcademique()).build();
        return toResponse(inscriptionRepo.save(i));
    }

    public InscriptionResponse autoSave(UUID id, UpdateInscriptionRequest req, UUID candidatId) {
        Inscription i = findAndCheckOwner(id, candidatId);
        if (req.dateNaissance() != null) i.setDateNaissance(req.dateNaissance());
        if (req.sexe() != null) i.setSexe(req.sexe());
        if (req.nationalite() != null) i.setNationalite(req.nationalite());
        if (req.telephone() != null) i.setTelephone(req.telephone());
        if (req.adresse() != null) i.setAdresse(req.adresse());
        if (req.typeInscription() != null) i.setTypeInscription(req.typeInscription());
        if (req.anneeAcademique() != null) i.setAnneeAcademique(req.anneeAcademique());
        if (req.formationId() != null) {
            Formation f = formationRepo.findById(req.formationId())
                .orElseThrow(() -> new ResourceNotFoundException("Formation", req.formationId().toString()));
            i.setFormation(f);
        }
        return toResponse(inscriptionRepo.save(i));
    }

    public InscriptionResponse soumettre(UUID id, UUID candidatId) {
        Inscription i = findAndCheckOwner(id, candidatId);
        if (!"BROUILLON".equals(i.getStatut())) throw new BusinessException("Dossier déjà soumis");
        if (i.getFormation() == null) throw new BusinessException("Veuillez choisir une formation");
        i.setStatut("SOUMIS"); i.setDateSoumission(Instant.now());
        Inscription saved = inscriptionRepo.save(i);
        workflowService.enregistrerTransition(id, null, "SOUMIS", "SOUMETTRE", candidatId, null);
        notificationService.sendConfirmationSoumission(saved);
        return toResponse(saved);
    }

    @Transactional(readOnly=true)
    public SuiviPublicResponse suiviPublic(String reference) {
        Inscription i = inscriptionRepo.findByNumeroReference(reference)
            .orElseThrow(() -> new ResourceNotFoundException("Dossier", reference));
        return new SuiviPublicResponse(i.getNumeroReference(), i.getStatut(),
            i.getDateCreation(), i.getDateSoumission(),
            i.getFormation() != null ? i.getFormation().getNom() : null);
    }

    @Transactional(readOnly=true)
    public List<InscriptionResponse> mesDossiers(UUID candidatId) {
        return inscriptionRepo.findByCandidatId(candidatId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly=true)
    public PagedResponse<InscriptionResponse> listAdmin(String statut, String formation, int page, int size) {
        Page<Inscription> p = inscriptionRepo.findFiltered(statut, formation, PageRequest.of(page, size));
        return new PagedResponse<>(p.getContent().stream().map(this::toResponse).toList(), p.getTotalElements(), p.getTotalPages(), page, size);
    }

    public InscriptionResponse transitionAdmin(UUID id, TransitionRequest req, UUID agentId) {
        Inscription i = inscriptionRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Inscription", id.toString()));
        String ancienStatut = i.getStatut();
        switch (req.action().toUpperCase()) {
            case "PRENDRE_EN_CHARGE_DOC" -> i.setStatut("EN_VALIDATION_DOC");
            case "VALIDER_DOCS" -> { i.setStatut("DOCS_VALIDES"); i.setValidationScolarite(true); }
            case "PRENDRE_EN_CHARGE_FIN" -> i.setStatut("EN_VALIDATION_FIN");
            case "VALIDER_FIN" -> {
                i.setValidationFinancier(true);
                if (i.isValidationScolarite()) {
                    i.setStatut("APPROUVE"); i.setDateTraitement(Instant.now());
                    notificationService.sendApprouveEmail(i);
                }
            }
            case "REJETER" -> {
                i.setStatut("REJETE"); i.setMotifRejet(req.motif()); i.setDateTraitement(Instant.now());
                notificationService.sendRejeteEmail(i);
            }
            case "DEMANDER_COMPLEMENT" -> {
                i.setStatut("EN_ATTENTE_COMPLEMENT");
                i.setDateExpiration(Instant.now().plus(7, java.time.temporal.ChronoUnit.DAYS));
                notificationService.sendDemandeComplementEmail(i, req.motif());
            }
            default -> throw new BusinessException("Action inconnue : " + req.action());
        }
        Inscription saved = inscriptionRepo.save(i);
        workflowService.enregistrerTransition(id, ancienStatut, i.getStatut(), req.action(), agentId, req.motif());
        return toResponse(saved);
    }

    private Inscription findAndCheckOwner(UUID id, UUID candidatId) {
        Inscription i = inscriptionRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Inscription", id.toString()));
        if (!i.getCandidatId().equals(candidatId)) throw new BusinessException("Accès non autorisé");
        return i;
    }

    private InscriptionResponse toResponse(Inscription i) {
        String candidatNom = utilisateurRepo.findById(i.getCandidatId()).map(u -> u.getPrenom()+" "+u.getNom()).orElse("");
        return new InscriptionResponse(i.getId(), i.getNumeroReference(), i.getCandidatId(), candidatNom,
            i.getFormation()!=null?i.getFormation().getNom():null, i.getFormation()!=null?i.getFormation().getCode():null,
            i.getStatut(), i.getTypeInscription(), i.getAnneeAcademique(),
            i.getDateNaissance(), i.getSexe(), i.getNationalite(), i.getTelephone(), i.getAdresse(),
            i.isEmailVerifie(), i.getDateCreation(), i.getDateSoumission());
    }
}
