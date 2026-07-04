package com.pkfokam.inscription.message.controller;

import com.pkfokam.inscription.auth.security.AuthenticatedUser;
import com.pkfokam.inscription.message.dto.MessageDtos.*;
import com.pkfokam.inscription.message.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/v1/messages")
@RequiredArgsConstructor @Tag(name="Messages")
public class MessageController {

    private final MessageService messageService;

    // ---- CANDIDAT ----

    @GetMapping("/mes-conversations")
    @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary="Conversations du candidat connecté")
    public ResponseEntity<List<ConversationSummary>> mesConversations(@AuthenticationPrincipal AuthenticatedUser u) {
        return ResponseEntity.ok(messageService.listeConversationsCandidat(u.id()));
    }

    @PostMapping("/conversations")
    @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary="Créer une nouvelle conversation")
    public ResponseEntity<ConversationDetail> creer(@RequestBody CreerConversationRequest req,
                                                     @AuthenticationPrincipal AuthenticatedUser u) {
        return ResponseEntity.status(201).body(messageService.creerConversation(u.id(), req));
    }

    // ---- ADMIN ----

    @GetMapping("/conversations")
    @PreAuthorize("hasAnyRole('AGENT_SCOLARITE','AGENT_FINANCIER','SUPER_ADMIN')")
    @Operation(summary="Toutes les conversations (admin)")
    public ResponseEntity<List<ConversationSummary>> toutesConversations() {
        return ResponseEntity.ok(messageService.listeConversationsAdmin());
    }

    @PatchMapping("/conversations/{id}/statut")
    @PreAuthorize("hasAnyRole('AGENT_SCOLARITE','AGENT_FINANCIER','SUPER_ADMIN')")
    @Operation(summary="Mettre à jour le statut d'une conversation")
    public ResponseEntity<ConversationSummary> updateStatut(@PathVariable UUID id,
                                                             @RequestBody UpdateConversationRequest req) {
        return ResponseEntity.ok(messageService.updateStatut(id, req));
    }

    // ---- COMMUN ----

    @GetMapping("/conversations/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary="Détail conversation avec messages")
    public ResponseEntity<ConversationDetail> detail(@PathVariable UUID id) {
        return ResponseEntity.ok(messageService.detail(id));
    }

    @PostMapping("/envoyer")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary="Envoyer un message dans une conversation")
    public ResponseEntity<MessageResponse> envoyer(@RequestBody EnvoyerMessageRequest req,
                                                    @AuthenticationPrincipal AuthenticatedUser u) {
        String role = u.role().name().equals("CANDIDAT") ? "candidat" : "admin";
        return ResponseEntity.status(201).body(messageService.envoyerMessage(u.id(), role, req));
    }

    @PostMapping("/conversations/{id}/marquer-lus")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary="Marquer les messages d'une conversation comme lus")
    public ResponseEntity<Void> marquerLus(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser u) {
        String role = u.role().name().equals("CANDIDAT") ? "candidat" : "admin";
        messageService.marquerLus(id, role);
        return ResponseEntity.ok().build();
    }
}
