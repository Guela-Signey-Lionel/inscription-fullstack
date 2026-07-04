package com.pkfokam.inscription.utilisateur.controller;

import com.pkfokam.inscription.auth.entity.Role;
import com.pkfokam.inscription.auth.entity.Utilisateur;
import com.pkfokam.inscription.auth.repository.UtilisateurRepository;
import com.pkfokam.inscription.auth.security.AuthenticatedUser;
import com.pkfokam.inscription.shared.exception.BusinessException;
import com.pkfokam.inscription.shared.exception.ResourceNotFoundException;
import com.pkfokam.inscription.utilisateur.dto.ChangePasswordRequest;
import com.pkfokam.inscription.utilisateur.dto.UpdateProfilRequest;
import com.pkfokam.inscription.utilisateur.dto.UtilisateurResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Utilisateurs")
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    /* ──────────────────────────────────────────
       Profil de l'utilisateur connecté
    ────────────────────────────────────────── */

    @GetMapping("/api/v1/auth/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Profil de l'utilisateur connecté")
    public ResponseEntity<UtilisateurResponse> me(@AuthenticationPrincipal AuthenticatedUser u) {
        Utilisateur user = utilisateurRepo.findById(u.id())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", u.id().toString()));
        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping("/api/v1/auth/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mettre à jour son profil")
    public ResponseEntity<UtilisateurResponse> updateMe(
            @RequestBody UpdateProfilRequest req,
            @AuthenticationPrincipal AuthenticatedUser u) {
        Utilisateur user = utilisateurRepo.findById(u.id())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", u.id().toString()));
        if (req.nom() != null && !req.nom().isBlank()) user.setNom(req.nom());
        if (req.prenom() != null && !req.prenom().isBlank()) user.setPrenom(req.prenom());
        return ResponseEntity.ok(toResponse(utilisateurRepo.save(user)));
    }

    @PostMapping("/api/v1/auth/change-password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Changer son mot de passe")
    public ResponseEntity<Void> changePassword(
            @RequestBody @Valid ChangePasswordRequest req,
            @AuthenticationPrincipal AuthenticatedUser u) {
        Utilisateur user = utilisateurRepo.findById(u.id())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", u.id().toString()));
        if (!passwordEncoder.matches(req.ancienMotDePasse(), user.getMotDePasse())) {
            throw new BusinessException("Mot de passe actuel incorrect");
        }
        user.setMotDePasse(passwordEncoder.encode(req.nouveauMotDePasse()));
        utilisateurRepo.save(user);
        return ResponseEntity.ok().build();
    }

    /* ──────────────────────────────────────────
       Endpoints Admin — gestion des utilisateurs
    ────────────────────────────────────────── */

    @GetMapping("/api/v1/admin/utilisateurs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Liste de tous les utilisateurs (admin)")
    public ResponseEntity<List<UtilisateurResponse>> listerUtilisateurs(
            @RequestParam(required = false) String role) {
        List<Utilisateur> users = role != null
                ? utilisateurRepo.findByRole(Role.valueOf(role.toUpperCase()))
                : utilisateurRepo.findAll();
        return ResponseEntity.ok(users.stream().map(this::toResponse).toList());
    }

    @GetMapping("/api/v1/admin/utilisateurs/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Détail d'un utilisateur (admin)")
    public ResponseEntity<UtilisateurResponse> getUtilisateur(@PathVariable UUID id) {
        return ResponseEntity.ok(toResponse(utilisateurRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id.toString()))));
    }

    @PatchMapping("/api/v1/admin/utilisateurs/{id}/statut")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Activer / désactiver un utilisateur")
    public ResponseEntity<UtilisateurResponse> toggleStatut(@PathVariable UUID id) {
        Utilisateur user = utilisateurRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id.toString()));
        user.setActif(!user.isActif());
        return ResponseEntity.ok(toResponse(utilisateurRepo.save(user)));
    }

    @PutMapping("/api/v1/admin/utilisateurs/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Changer le rôle d'un utilisateur")
    public ResponseEntity<UtilisateurResponse> updateRole(
            @PathVariable UUID id,
            @RequestBody java.util.Map<String, String> body) {
        Utilisateur user = utilisateurRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id.toString()));
        user.setRole(Role.valueOf(body.get("role").toUpperCase()));
        return ResponseEntity.ok(toResponse(utilisateurRepo.save(user)));
    }

    private UtilisateurResponse toResponse(Utilisateur u) {
        return new UtilisateurResponse(u.getId(), u.getNom(), u.getPrenom(), u.getEmail(),
                u.getRole(), u.isActif(), u.getProvider().name(), u.getDateCreation());
    }
}
