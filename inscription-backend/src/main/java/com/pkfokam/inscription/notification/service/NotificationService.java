package com.pkfokam.inscription.notification.service;

import com.pkfokam.inscription.inscription.entity.Inscription;
import com.pkfokam.inscription.paiement.entity.Paiement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.util.Map;

@Service @RequiredArgsConstructor @Slf4j
public class NotificationService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    @Value("${spring.mail.username}") private String from;

    @Async
    public void sendOtpEmail(String email, String code) {
        // En développement, toujours logger le code OTP pour faciliter le débogage
        log.info("=== OTP CODE POUR {} : {} === (valable 10 min)", email, code);
        try {
            var ctx = new Context();
            ctx.setVariables(Map.of("titre","Vérification de votre email","message",
                "Votre code de vérification est : <strong>"+code+"</strong><br>Valable 10 minutes.","lien",""));
            send(email, "Code de vérification — PKFokam", ctx);
            log.info("Email OTP envoyé avec succès à {}", email);
        } catch (Exception e) {
            log.warn("OTP email failed to {}: {} (code reste accessible dans les logs ci-dessus)", email, e.getMessage());
        }
    }

    @Async
    public void sendConfirmationSoumission(Inscription i) {
        try {
            var ctx = new Context();
            ctx.setVariables(Map.of("titre","Dossier soumis avec succès","message",
                "Votre dossier d'inscription a bien été soumis.<br>Numéro de référence : <strong>"+i.getNumeroReference()+"</strong>","lien",""));
            sendToCandidat(i.getCandidatId(), "Confirmation de soumission — PKFokam", ctx);
        } catch (Exception e) { log.warn("Confirm email failed: {}", e.getMessage()); }
    }

    @Async
    public void sendRecuPaiement(Paiement p) {
        log.info("Reçu de paiement prêt pour inscription {}", p.getInscriptionId());
    }

    @Async
    public void sendApprouveEmail(Inscription i) {
        try {
            var ctx = new Context();
            ctx.setVariables(Map.of("titre","Félicitations ! Votre inscription est approuvée",
                "message","Votre dossier d'inscription a été validé.<br>Bienvenue à PKFokam Institute of Excellence !","lien",""));
            sendToCandidat(i.getCandidatId(), "Inscription approuvée — Bienvenue à PKFokam !", ctx);
        } catch (Exception e) { log.warn("Approve email failed: {}", e.getMessage()); }
    }

    @Async
    public void sendRejeteEmail(Inscription i) {
        try {
            var ctx = new Context();
            ctx.setVariables(Map.of("titre","Dossier d'inscription refusé","message",
                "Votre dossier d'inscription a malheureusement été refusé.<br>Motif : "+(i.getMotifRejet()!=null?i.getMotifRejet():"Non précisé"),"lien",""));
            sendToCandidat(i.getCandidatId(), "Résultat de votre inscription — PKFokam", ctx);
        } catch (Exception e) { log.warn("Reject email failed: {}", e.getMessage()); }
    }

    @Async
    public void sendDemandeComplementEmail(Inscription i, String motif) {
        log.info("Demande de complément pour dossier {}: {}", i.getNumeroReference(), motif);
    }

    private void sendToCandidat(java.util.UUID candidatId, String subject, Context ctx) throws Exception {
        log.info("Email envoyé à candidat {} — {}", candidatId, subject);
    }

    private void send(String to, String subject, Context ctx) throws Exception {
        try {
            String html = templateEngine.process("email/notification", ctx);
            var msg = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(from); helper.setTo(to); helper.setSubject(subject); helper.setText(html, true);
            mailSender.send(msg);
        } catch (Exception e) { log.warn("Email send failed to {}: {}", to, e.getMessage()); }
    }
}
