package com.pkfokam.inscription.inscription.controller;

import com.pkfokam.inscription.auth.security.AuthenticatedUser;
import com.pkfokam.inscription.inscription.dto.*;
import com.pkfokam.inscription.inscription.entity.Formation;
import com.pkfokam.inscription.inscription.repository.FormationRepository;
import com.pkfokam.inscription.inscription.service.InscriptionService;
import com.pkfokam.inscription.shared.util.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/v1/inscriptions")
@RequiredArgsConstructor @Tag(name="Inscriptions")
public class InscriptionController {
    private final InscriptionService inscriptionService;
    private final FormationRepository formationRepo;

    @PostMapping @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary="Créer un dossier (étape initiale)")
    public ResponseEntity<InscriptionResponse> creer(@RequestBody CreateInscriptionRequest req, @AuthenticationPrincipal AuthenticatedUser u) {
        return ResponseEntity.status(201).body(inscriptionService.creer(u.id(), req));
    }

    @PatchMapping("/{id}") @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary="Auto-save données wizard")
    public ResponseEntity<InscriptionResponse> autoSave(@PathVariable UUID id, @RequestBody UpdateInscriptionRequest req, @AuthenticationPrincipal AuthenticatedUser u) {
        return ResponseEntity.ok(inscriptionService.autoSave(id, req, u.id()));
    }

    @PostMapping("/{id}/soumettre") @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary="Soumettre le dossier (étape 5)")
    public ResponseEntity<InscriptionResponse> soumettre(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser u) {
        return ResponseEntity.ok(inscriptionService.soumettre(id, u.id()));
    }

    @GetMapping("/mes-dossiers") @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary="Mes dossiers")
    public ResponseEntity<List<InscriptionResponse>> mesDossiers(@AuthenticationPrincipal AuthenticatedUser u) {
        return ResponseEntity.ok(inscriptionService.mesDossiers(u.id()));
    }

    @GetMapping("/suivi/{reference}")
    @Operation(summary="Suivi public par référence (sans connexion)")
    public ResponseEntity<SuiviPublicResponse> suivi(@PathVariable String reference) {
        return ResponseEntity.ok(inscriptionService.suiviPublic(reference));
    }

    @GetMapping @PreAuthorize("hasAnyRole('AGENT_SCOLARITE','AGENT_FINANCIER','SUPER_ADMIN')")
    @Operation(summary="Liste paginée des dossiers (Admin)")
    public ResponseEntity<PagedResponse<InscriptionResponse>> list(
        @RequestParam(required=false) String statut, @RequestParam(required=false) String formation,
        @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(inscriptionService.listAdmin(statut, formation, page, size));
    }

    @PostMapping("/{id}/transition") @PreAuthorize("hasAnyRole('AGENT_SCOLARITE','AGENT_FINANCIER','SUPER_ADMIN')")
    @Operation(summary="Changer l'état du dossier")
    public ResponseEntity<InscriptionResponse> transition(@PathVariable UUID id, @RequestBody @Valid TransitionRequest req, @AuthenticationPrincipal AuthenticatedUser u) {
        return ResponseEntity.ok(inscriptionService.transitionAdmin(id, req, u.id()));
    }
}
