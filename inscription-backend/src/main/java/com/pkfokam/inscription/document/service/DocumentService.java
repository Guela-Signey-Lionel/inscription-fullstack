package com.pkfokam.inscription.document.service;

import com.pkfokam.inscription.document.dto.*;
import com.pkfokam.inscription.document.entity.Document;
import com.pkfokam.inscription.document.repository.DocumentRepository;
import com.pkfokam.inscription.inscription.repository.InscriptionRepository;
import com.pkfokam.inscription.notification.service.NotificationService;
import com.pkfokam.inscription.shared.exception.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;

@Service @RequiredArgsConstructor @Slf4j @Transactional
public class DocumentService {
    private final DocumentRepository documentRepo;
    private final InscriptionRepository inscriptionRepo;
    private final NotificationService notificationService;
    @Value("${app.upload.path:./uploads}") private String uploadPath;

    private static final List<String> ALLOWED_MIME = List.of("application/pdf","image/jpeg","image/png");
    private static final long MAX_SIZE = 5 * 1024 * 1024L;

    public DocumentResponse upload(UUID inscriptionId, String typeDocument, MultipartFile file) throws IOException {
        // Validation
        if (file.getSize() > MAX_SIZE) throw new BusinessException("Fichier trop volumineux (max 5MB)");
        String mime = file.getContentType();
        if (!ALLOWED_MIME.contains(mime)) throw new BusinessException("Format non accepté. Utilisez PDF, JPG ou PNG.");

        String uuid = UUID.randomUUID().toString();
        String ext = Objects.requireNonNull(file.getOriginalFilename()).contains(".")
            ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")) : "";
        String nomStockage = uuid + ext;

        Path dir = Paths.get(uploadPath, "documents");
        Files.createDirectories(dir);
        Files.write(dir.resolve(nomStockage), file.getBytes());

        Document doc = Document.builder()
            .inscriptionId(inscriptionId)
            .typeDocument(typeDocument)
            .nomOriginal(file.getOriginalFilename())
            .nomStockage(nomStockage)
            .mimeType(mime)
            .taille(file.getSize())
            .build();
        Document saved = documentRepo.save(doc);

        // OCR asynchrone pour les relevés de notes
        if ("RELEVE_NOTES".equals(typeDocument) && "application/pdf".equals(mime)) {
            runOcrAsync(saved.getId(), dir.resolve(nomStockage));
        }

        return toResponse(saved);
    }

    @Async
    public void runOcrAsync(UUID docId, Path filePath) {
        try {
            Map<String,Object> donnees = new HashMap<>();
            donnees.put("status","OCR_PENDING");
            donnees.put("info","Extraction automatique en cours...");
            documentRepo.findById(docId).ifPresent(d -> {
                d.setDonneesOcr(donnees); documentRepo.save(d);
            });
        } catch (Exception e) { log.warn("OCR failed for doc {}: {}", docId, e.getMessage()); }
    }

    @Transactional(readOnly=true)
    public List<DocumentResponse> byInscription(UUID inscriptionId) {
        return documentRepo.findByInscriptionId(inscriptionId).stream().map(this::toResponse).toList();
    }

    public DocumentResponse valider(UUID docId, ValiderDocumentRequest req, UUID agentId) {
        Document doc = documentRepo.findById(docId).orElseThrow(() -> new ResourceNotFoundException("Document", docId.toString()));
        doc.setStatut(req.statut());
        doc.setMotifRejet("REJETE".equals(req.statut()) ? req.motifRejet() : null);
        doc.setValidateurId(agentId); doc.setDateValidation(Instant.now());
        return toResponse(documentRepo.save(doc));
    }

    private DocumentResponse toResponse(Document d) {
        return new DocumentResponse(d.getId(), d.getInscriptionId(), d.getTypeDocument(),
            d.getNomOriginal(), d.getMimeType(), d.getTaille(), d.getStatut(),
            d.getMotifRejet(), d.getDonneesOcr(), d.getDateUpload());
    }
}
