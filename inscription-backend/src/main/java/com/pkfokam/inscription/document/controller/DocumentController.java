package com.pkfokam.inscription.document.controller;

import com.pkfokam.inscription.auth.security.AuthenticatedUser;
import com.pkfokam.inscription.document.dto.*;
import com.pkfokam.inscription.document.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@RestController @RequestMapping("/api/v1/documents")
@RequiredArgsConstructor @Tag(name="Documents")
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping(value="/upload",consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary="Uploader un document")
    public ResponseEntity<DocumentResponse> upload(
        @RequestParam UUID inscriptionId, @RequestParam String typeDocument,
        @RequestPart("file") MultipartFile file,
        @AuthenticationPrincipal AuthenticatedUser u) throws IOException {
        return ResponseEntity.status(201).body(documentService.upload(inscriptionId, typeDocument, file));
    }

    @GetMapping("/inscription/{inscriptionId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary="Documents d'un dossier")
    public ResponseEntity<List<DocumentResponse>> byInscription(@PathVariable UUID inscriptionId) {
        return ResponseEntity.ok(documentService.byInscription(inscriptionId));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('AGENT_SCOLARITE','SUPER_ADMIN')")
    @Operation(summary="Valider/Rejeter un document")
    public ResponseEntity<DocumentResponse> valider(@PathVariable UUID id, @RequestBody ValiderDocumentRequest req, @AuthenticationPrincipal AuthenticatedUser u) {
        return ResponseEntity.ok(documentService.valider(id, req, u.id()));
    }
}
