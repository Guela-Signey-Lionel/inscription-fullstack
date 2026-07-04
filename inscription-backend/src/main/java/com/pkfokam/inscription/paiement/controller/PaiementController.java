package com.pkfokam.inscription.paiement.controller;

import com.pkfokam.inscription.auth.security.AuthenticatedUser;
import com.pkfokam.inscription.paiement.dto.*;
import com.pkfokam.inscription.paiement.service.PaiementService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequiredArgsConstructor @Slf4j @Tag(name="Paiements")
public class PaiementController {
    private final PaiementService paiementService;
    @Value("${app.stripe.webhook-secret}") private String webhookSecret;

    @PostMapping("/api/v1/paiements/intent")
    @PreAuthorize("hasRole('CANDIDAT')")
    @Operation(summary="Créer un PaymentIntent Stripe")
    public ResponseEntity<PaymentIntentResponse> createIntent(@RequestBody CreatePaymentIntentRequest req, @AuthenticationPrincipal AuthenticatedUser u) throws Exception {
        return ResponseEntity.ok(paiementService.createPaymentIntent(req, u.id()));
    }

    @GetMapping("/api/v1/paiements/inscription/{inscriptionId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary="Statut paiement d'un dossier")
    public ResponseEntity<PaiementResponse> get(@PathVariable UUID inscriptionId) {
        return ResponseEntity.ok(paiementService.getByInscription(inscriptionId));
    }

    @PostMapping("/api/v1/stripe/webhook")
    @Operation(summary="Webhook Stripe (confirmation paiement)")
    public ResponseEntity<String> webhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            if ("payment_intent.succeeded".equals(event.getType())) {
                PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);
                if (intent != null) paiementService.handleWebhookSucceeded(intent.getId());
            }
            return ResponseEntity.ok("OK");
        } catch (SignatureVerificationException e) {
            log.error("Webhook Stripe signature invalide");
            return ResponseEntity.status(400).body("Invalid signature");
        } catch (Exception e) {
            log.error("Webhook error: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error");
        }
    }
}
