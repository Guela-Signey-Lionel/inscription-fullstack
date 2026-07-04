package com.pkfokam.inscription.paiement.service;

import com.pkfokam.inscription.inscription.repository.*;
import com.pkfokam.inscription.notification.service.NotificationService;
import com.pkfokam.inscription.paiement.dto.*;
import com.pkfokam.inscription.paiement.entity.Paiement;
import com.pkfokam.inscription.paiement.repository.PaiementRepository;
import com.pkfokam.inscription.shared.exception.*;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.*;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service @RequiredArgsConstructor @Slf4j @Transactional
public class PaiementService {
    private final PaiementRepository paiementRepo;
    private final InscriptionRepository inscriptionRepo;
    private final NotificationService notificationService;
    @Value("${app.stripe.secret-key}") private String stripeSecretKey;
    @Value("${app.stripe.publishable-key}") private String stripePublishableKey;
    @Value("${app.upload.path:./uploads}") private String uploadPath;

    public PaymentIntentResponse createPaymentIntent(CreatePaymentIntentRequest req, UUID candidatId) throws StripeException {
        var inscription = inscriptionRepo.findById(req.inscriptionId())
            .orElseThrow(() -> new ResourceNotFoundException("Inscription", req.inscriptionId().toString()));
        if (inscription.getFormation() == null) throw new BusinessException("Aucune formation sélectionnée");

        // Vérifier doublon
        paiementRepo.findByInscriptionId(req.inscriptionId()).ifPresent(p -> {
            if ("SUCCEEDED".equals(p.getStatut())) throw new BusinessException("Paiement déjà effectué pour ce dossier");
        });

        Stripe.apiKey = stripeSecretKey;
        BigDecimal montant = inscription.getFormation().getFraisInscription();
        String idempotencyKey = "inscription-" + req.inscriptionId();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(montant.multiply(new BigDecimal("100")).longValue())
            .setCurrency("xaf")
            .putMetadata("inscriptionId", req.inscriptionId().toString())
            .putMetadata("candidatId", candidatId.toString())
            .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Paiement p = Paiement.builder()
            .inscriptionId(req.inscriptionId())
            .stripePaymentIntentId(intent.getId())
            .idempotencyKey(idempotencyKey)
            .montant(montant).devise("XAF").build();
        paiementRepo.save(p);

        return new PaymentIntentResponse(intent.getClientSecret(), intent.getId(), montant, "XAF", stripePublishableKey);
    }

    public void handleWebhookSucceeded(String paymentIntentId) {
        paiementRepo.findByStripePaymentIntentId(paymentIntentId).ifPresent(p -> {
            p.setStatut("SUCCEEDED"); p.setDateConfirmation(Instant.now());
            try {
                String recuUrl = generateRecuPdf(p);
                p.setRecuPdfUrl(recuUrl);
            } catch (IOException e) { log.warn("Erreur génération reçu PDF: {}", e.getMessage()); }
            paiementRepo.save(p);
            notificationService.sendRecuPaiement(p);
        });
    }

    private String generateRecuPdf(Paiement p) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                PDFont bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDFont normal = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
                cs.beginText();
                cs.setFont(bold, 18); cs.newLineAtOffset(50, 780);
                cs.showText("REÇU DE PAIEMENT"); cs.newLine();
                cs.setFont(normal, 10); cs.newLineAtOffset(0, -20);
                cs.showText("PKFokam Institute of Excellence"); cs.newLine();
                cs.showText("N° Transaction : " + p.getStripePaymentIntentId()); cs.newLine();
                cs.showText("Date : " + DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.of("Africa/Douala")).format(p.getDateConfirmation())); cs.newLine();
                cs.showText("Montant : " + p.getMontant() + " " + p.getDevise()); cs.newLine();
                cs.showText("Statut : PAIEMENT CONFIRMÉ"); cs.endText();
            }
            String filename = "recu_" + p.getId() + ".pdf";
            Path dir = Paths.get(uploadPath, "recus");
            Files.createDirectories(dir);
            doc.save(dir.resolve(filename).toFile());
            return "/uploads/recus/" + filename;
        }
    }

    @Transactional(readOnly=true)
    public PaiementResponse getByInscription(UUID inscriptionId) {
        return paiementRepo.findByInscriptionId(inscriptionId)
            .map(p -> new PaiementResponse(p.getId(), p.getInscriptionId(), p.getMontant(), p.getDevise(), p.getStatut(), p.getRecuPdfUrl(), p.getDateConfirmation()))
            .orElse(null);
    }
}
